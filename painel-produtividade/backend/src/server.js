import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = 'sua_chave_secreta_super_segura_2024';

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Erro ao conectar ao banco:', err);
  console.log('✓ Conectado ao banco de dados SQLite');
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
      role TEXT DEFAULT 'user',
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

  // Inserir dados de demo
  seedDB();
}

// Seed dados de demo
async function seedDB() {
  try {
    const adminExists = await dbGet('SELECT id FROM users WHERE email = ?', ['admin@agencia.com']);
    if (!adminExists) {
      const hashedPassword = await bcryptjs.hash('123456', 10);
      
      // Admin
      await dbRun(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Diretor Admin', 'admin@agencia.com', hashedPassword, 'admin']
      );

      // Usuário demo
      await dbRun(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Usuário Demo', 'usuario@agencia.com', hashedPassword, 'user']
      );

      // Inserir demandas demo
      const users = await dbAll('SELECT id FROM users');
      const categorias = ['Design', 'Copy', 'Tráfego Pago', 'Automação', 'Reunião', 'Suporte'];
      const clientes = ['Empresa A', 'Empresa B', 'Empresa C', 'Startup X', 'Premium Y'];

      for (let i = 0; i < 15; i++) {
        await dbRun(
          'INSERT INTO demandas (userId, categoria, cliente, descricao, tempo, status) VALUES (?, ?, ?, ?, ?, ?)',
          [
            users[i % 2].id,
            categorias[i % categorias.length],
            clientes[i % clientes.length],
            `Descrição da demanda ${i + 1}`,
            Math.floor(Math.random() * 240) + 30,
            ['Pendente', 'Em andamento', 'Finalizado'][i % 3]
          ]
        );
      }

      console.log('✓ Dados de demo inseridos');
    }
  } catch (error) {
    console.error('Erro ao seed DB:', error);
  }
}

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
    const { name, email, password } = req.body;

    const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const result = await dbRun(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    const user = await dbGet('SELECT id, name, email, role FROM users WHERE id = ?', [result.id]);
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

    const userObj = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '30d' });

    res.json({ token, user: userObj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, name, email, role, avatar FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
      'SELECT id, name, email, role, avatar FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== DEMANDAS ROUTES ====================

// Get demandas do usuário
app.get('/api/demandas', authenticateToken, async (req, res) => {
  try {
    const { categoria, status } = req.query;
    let query = 'SELECT * FROM demandas WHERE userId = ? ORDER BY data DESC';
    let params = [req.user.id];

    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    const demandas = await dbAll(query, params);
    res.json(demandas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create demanda
app.post('/api/demandas', authenticateToken, async (req, res) => {
  try {
    const { categoria, cliente, descricao, tempo, status } = req.body;

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

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const users = await dbAll('SELECT id, name, email, role, avatar FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/demandas', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { userId, categoria, status } = req.query;
    let query = 'SELECT * FROM demandas WHERE 1=1';
    let params = [];

    if (userId) {
      query += ' AND userId = ?';
      params.push(userId);
    }
    if (categoria) {
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

// ==================== SERVER ====================

app.listen(PORT, () => {
  console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
  console.log('✓ CORS habilitado');
  console.log('✓ Banco de dados pronto');
  console.log('\n📧 Contas de demo:');
  console.log('   Admin: admin@agencia.com / 123456');
  console.log('   Usuário: usuario@agencia.com / 123456');
});
