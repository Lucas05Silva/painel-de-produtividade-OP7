import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const [, , email] = process.argv;
if (!email) {
  console.error('Uso: node promote_user.js <email>');
  process.exit(1);
}

const DB_PATH = join(__dirname, 'database.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao abrir DB:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run("UPDATE users SET userType = 'colaborador' WHERE userType = 'adm_supremo' AND email != ?", [email], function(err) {
    if (err) console.error('Erro ao demote outros admins:', err.message);
  });

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err.message);
      process.exit(1);
    }

    if (!row) {
      // Criar usuário mínimo se não existir
      const bcrypt = await import('bcryptjs');
      const hashed = await bcrypt.hash('AdminSupremo123!', 10);
      db.run('INSERT INTO users (name, email, password, userType) VALUES (?, ?, ?, ?)', ['OP7 Admin', email, hashed, 'adm_supremo'], function(insErr) {
        if (insErr) {
          console.error('Erro ao criar usuário:', insErr.message);
          process.exit(1);
        }
        console.log('Usuário criado e promovido para adm_supremo:', email);
        process.exit(0);
      });
    } else {
      db.run('UPDATE users SET userType = ? WHERE id = ?', ['adm_supremo', row.id], function(upErr) {
        if (upErr) {
          console.error('Erro ao promover usuário:', upErr.message);
          process.exit(1);
        }
        console.log('Usuário promovido para adm_supremo:', email);
        process.exit(0);
      });
    }
  });
});
