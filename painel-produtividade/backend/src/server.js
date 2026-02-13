import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_2024';

// Middleware
const CORS_ORIGIN = process.env.CORS_ORIGIN || true;
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Inicializar banco de dados SQLite (caminho absoluto relativo a este arquivo ou via env)
const DB_PATH = process.env.DATABASE_PATH || join(__dirname, '..', 'database.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Erro ao conectar ao banco:', err);
  console.log('✓ Conectado ao banco de dados SQLite');
  console.log('  DB path:', DB_PATH);
  initDB();
});

// Helpers para usar promises com callbacks do sqlite3
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Inicializar tabelas
function initDB() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      userType TEXT DEFAULT 'colaborador',
      avatar TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS demandas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      categoria TEXT NOT NULL,
      cliente TEXT NOT NULL,
      descricao TEXT NOT NULL,
      tempo INTEGER NOT NULL,
      status TEXT DEFAULT 'Pendente',
      data DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      token TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `;

  sql.split(';').forEach(statement => {
    if (statement.trim()) {
      db.run(statement);
    }
  });

  // Inicializar banco de dados vazio (sem dados de demo)
  initializeAdminUser();
}

// Inicializar com admins padrão
async function initializeAdminUser() {
  try {
    // Garantir que apenas op7f.ai@gmail.com seja adm_supremo
    // 1) Demote qualquer outro adm_supremo
    await dbRun("UPDATE users SET userType = 'colaborador' WHERE userType = 'adm_supremo' AND email != ?", ['op7f.ai@gmail.com']);

    // 2) Criar ou promover o usuário op7f.ai@gmail.com para adm_supremo
    const op7Admin = await dbGet('SELECT id FROM users WHERE email = ?', ['op7f.ai@gmail.com']);
    if (!op7Admin) {
      const hashedPassword = await bcryptjs.hash('AdminSupremo123!', 10);
      await dbRun(
        'INSERT INTO users (name, email, password, userType) VALUES (?, ?, ?, ?)',
        ['OP7 Admin', 'op7f.ai@gmail.com', hashedPassword, 'adm_supremo']
      );
      console.log('✓ ADM Supremo OP7 criado');
      console.log('  Email: op7f.ai@gmail.com');
      console.log('  Senha: AdminSupremo123!');
    } else {
      await dbRun('UPDATE users SET userType = ? WHERE id = ?', ['adm_supremo', op7Admin.id]);
      console.log('✓ Usuário op7f.ai@gmail.com definido como ADM Supremo');
    }

    // 3) Se existir admin@agencia.com, demote para colaborador (segurança)
    const adminExists = await dbGet('SELECT id FROM users WHERE email = ?', ['admin@agencia.com']);
    if (adminExists) {
      await dbRun('UPDATE users SET userType = ? WHERE id = ?', ['colaborador', adminExists.id]);
      console.log('✓ admin@agencia.com demoted para colaborador');
    }
  } catch (error) {
    console.error('Erro ao inicializar admin:', error);
  }
}

// Função auxiliar para validar categorias
const CATEGORIAS_VALIDAS = [
  'Automação & IA',
  'Planejamento',
  'Criação & Design',
  'Suporte & Atendimento',
  'Tráfego Pago'
];

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token ausente' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    const validUserTypes = ['colaborador', 'diretor', 'adm_supremo'];
    const type = userType || 'colaborador';
    
    if (!validUserTypes.includes(type)) {
      return res.status(400).json({ message: 'Tipo de usuário inválido' });
    }

    const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const result = await dbRun(
      'INSERT INTO users (name, email, password, userType) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, type]
    );

    const user = await dbGet('SELECT id, name, email, userType FROM users WHERE id = ?', [result.id]);
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    const userObj = { id: user.id, name: user.name, email: user.email, userType: user.userType };
    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '30d' });

    res.json({ token, user: userObj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  // Simples: se chegou aqui, token é válido. Retornar dados do token.
  res.json(req.user);
});

// Update profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatar, newPassword, currentPassword } = req.body;

    let updateQuery = 'UPDATE users SET ';
    let updates = [];
    let params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }

    if (avatar) {
      updates.push('avatar = ?');
      params.push(avatar);
    }

    if (newPassword && currentPassword) {
      const user = await dbGet('SELECT password FROM users WHERE id = ?', [req.user.id]);
      const validPassword = await bcryptjs.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Senha atual inválida' });
      }
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      updates.push('password = ?');
      params.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    updateQuery += updates.join(', ') + ' WHERE id = ?';
    params.push(req.user.id);

    await dbRun(updateQuery, params);

    const updatedUser = await dbGet(
      'SELECT id, name, email, userType, avatar FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== DEMANDAS ROUTES ====================

// Get demandas (com controle de acesso)
app.get('/api/demandas', authenticateToken, async (req, res) => {
  try {
    const { categoria, status, userId } = req.query;
    
    let query = 'SELECT * FROM demandas WHERE 1=1';
    let params = [];

    // Controle de acesso: colaborador vê apenas suas demandas
    if (req.user.userType === 'colaborador') {
      query += ' AND userId = ?';
      params.push(req.user.id);
    } else if (userId) {
      // Diretor ou admin podem filtrar por usuário
      query += ' AND userId = ?';
      params.push(userId);
    }

    if (categoria) {
      if (!CATEGORIAS_VALIDAS.includes(categoria)) {
        return res.status(400).json({ message: 'Categoria inválida' });
      }
      query += ' AND categoria = ?';
      params.push(categoria);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY data DESC';
    const demandas = await dbAll(query, params);
    res.json(demandas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get demanda by ID
app.get('/api/demandas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const demanda = await dbGet('SELECT * FROM demandas WHERE id = ? AND userId = ?', [id, req.user.id]);
    
    if (!demanda) {
      return res.status(404).json({ message: 'Demanda não encontrada' });
    }

    res.json(demanda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create demanda
app.post('/api/demandas', authenticateToken, async (req, res) => {
  try {
    const { categoria, cliente, descricao, tempo, status } = req.body;

    // Validar categoria
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      return res.status(400).json({ message: 'Categoria inválida. Categorias válidas: ' + CATEGORIAS_VALIDAS.join(', ') });
    }

    const result = await dbRun(
      'INSERT INTO demandas (userId, categoria, cliente, descricao, tempo, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, categoria, cliente, descricao, tempo, status || 'Pendente']
    );

    const demanda = await dbGet('SELECT * FROM demandas WHERE id = ?', [result.id]);
    res.status(201).json(demanda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update demanda
app.patch('/api/demandas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, categoria, cliente, descricao, tempo } = req.body;

    // Verificar se a demanda pertence ao usuário
    const demanda = await dbGet('SELECT * FROM demandas WHERE id = ? AND userId = ?', [id, req.user.id]);
    if (!demanda) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    let updates = [];
    let params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (categoria) {
      updates.push('categoria = ?');
      params.push(categoria);
    }
    if (cliente) {
      updates.push('cliente = ?');
      params.push(cliente);
    }
    if (descricao) {
      updates.push('descricao = ?');
      params.push(descricao);
    }
    if (tempo) {
      updates.push('tempo = ?');
      params.push(tempo);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    params.push(id);
    const query = `UPDATE demandas SET ${updates.join(', ')} WHERE id = ?`;
    await dbRun(query, params);

    const updatedDemanda = await dbGet('SELECT * FROM demandas WHERE id = ?', [id]);
    res.json(updatedDemanda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete demanda
app.delete('/api/demandas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const demanda = await dbGet('SELECT * FROM demandas WHERE id = ? AND userId = ?', [id, req.user.id]);
    if (!demanda) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await dbRun('DELETE FROM demandas WHERE id = ?', [id]);
    res.json({ message: 'Demanda deletada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== DASHBOARD ROUTES ====================

app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Total hoje
    const totalTodayResult = await dbGet(
      'SELECT SUM(tempo) as total FROM demandas WHERE userId = ? AND DATE(data) = ?',
      [req.user.id, today]
    );
    const totalToday = totalTodayResult?.total || 0;

    // Total semana
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const totalWeekResult = await dbGet(
      'SELECT SUM(tempo) as total FROM demandas WHERE userId = ? AND DATE(data) >= ?',
      [req.user.id, weekAgo]
    );
    const totalWeek = totalWeekResult?.total || 0;

    // Dados semanais
    const weeklyData = await dbAll(`
      SELECT 
        DATE(data) as date,
        SUM(tempo)/60 as hours
      FROM demandas
      WHERE userId = ? AND DATE(data) >= ?
      GROUP BY DATE(data)
    `, [req.user.id, weekAgo]);

    // Por categoria
    const byCategory = await dbAll(
      'SELECT categoria, SUM(tempo) as total FROM demandas WHERE userId = ? GROUP BY categoria',
      [req.user.id]
    );

    const byCategoryObj = {};
    byCategory.forEach(item => {
      byCategoryObj[item.categoria] = item.total;
    });

    // Produtividade média
    const allUsersAvg = await dbGet('SELECT AVG(tempo) as avg FROM demandas');
    const productivity = Math.round((totalToday / 480) * 100);
    const averageProductivity = Math.round((allUsersAvg?.avg || 0));

    // Ranking
    const ranking = await dbAll(`
      SELECT 
        u.id,
        SUM(d.tempo) as totalTempo
      FROM demandas d
      JOIN users u ON d.userId = u.id
      WHERE DATE(d.data) >= ?
      GROUP BY u.id
      ORDER BY totalTempo DESC
    `, [weekAgo]);

    const myRanking = ranking.findIndex(r => r.id === req.user.id) + 1 || 0;

    res.json({
      totalToday,
      totalWeek,
      productivity,
      averageProductivity,
      ranking: myRanking,
      weeklyData: weeklyData.map((d, i) => ({
        day: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][new Date(d.date).getDay()],
        hours: Math.round(d.hours || 0)
      })),
      byCategory: byCategoryObj
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== RANKING ROUTES ====================

app.get('/api/ranking', authenticateToken, async (req, res) => {
  try {
    const { period = 'semana' } = req.query;

    let daysAgo = 7;
    if (period === 'mês') daysAgo = 30;
    if (period === 'ano') daysAgo = 365;

    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const ranking = await dbAll(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar,
        SUM(d.tempo) as totalTempo
      FROM demandas d
      JOIN users u ON d.userId = u.id
      WHERE DATE(d.data) >= ?
      GROUP BY u.id
      ORDER BY totalTempo DESC
    `, [startDate]);

    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all users (apenas ADM Supremo ou Diretor)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'adm_supremo' && req.user.userType !== 'diretor') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const users = await dbAll('SELECT id, name, email, userType, avatar FROM users ORDER BY name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all demandas (apenas ADM Supremo ou Diretor)
app.get('/api/admin/demandas', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'adm_supremo' && req.user.userType !== 'diretor') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { userId, categoria, status } = req.query;
    let query = 'SELECT d.*, u.name FROM demandas d JOIN users u ON d.userId = u.id WHERE 1=1';
    let params = [];

    if (userId) {
      query += ' AND d.userId = ?';
      params.push(userId);
    }
    if (categoria) {
      query += ' AND d.categoria = ?';
      params.push(categoria);
    }
    if (status) {
      query += ' AND d.status = ?';
      params.push(status);
    }

    query += ' ORDER BY d.data DESC';
    const demandas = await dbAll(query, params);
    res.json(demandas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user type (apenas ADM Supremo)
app.put('/api/admin/users/:id/type', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'adm_supremo') {
      return res.status(403).json({ message: 'Apenas ADM Supremo pode alterar tipos de usuário' });
    }

    const { id } = req.params;
    const { userType } = req.body;

    const validUserTypes = ['colaborador', 'diretor', 'adm_supremo'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: 'Tipo de usuário inválido' });
    }

    // Não permitir múltiplos ADM Supremo
    if (userType === 'adm_supremo') {
      const existingAdmin = await dbGet('SELECT id FROM users WHERE userType = ? AND id != ?', ['adm_supremo', id]);
      if (existingAdmin) {
        return res.status(403).json({ message: 'Já existe um ADM Supremo' });
      }
    }

    await dbRun('UPDATE users SET userType = ? WHERE id = ?', [userType, id]);
    
    const updatedUser = await dbGet('SELECT id, name, email, userType, avatar FROM users WHERE id = ?', [id]);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (apenas ADM Supremo)
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'adm_supremo') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { id } = req.params;

    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'Não é possível deletar sua própria conta' });
    }

    // Deletar demandas do usuário
    await dbRun('DELETE FROM demandas WHERE userId = ?', [id]);
    // Deletar usuário
    await dbRun('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categorias válidas
app.get('/api/categorias', authenticateToken, async (req, res) => {
  res.json(CATEGORIAS_VALIDAS);
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await dbGet('SELECT 1 as ok');
    res.json({ status: 'ok', db: true });
  } catch (error) {
    res.status(500).json({ status: 'error', db: false, message: error.message });
  }
});

// ==================== SERVER ====================

app.listen(PORT, () => {
  console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
  console.log('✓ CORS habilitado');
  console.log('✓ Banco de dados pronto');
  console.log('');
  console.log('🔐 Sistema pronto para uso');
  console.log('   Acesse /login com suas credenciais');
});
