import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'database.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao abrir DB:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.all('SELECT id, name, email, userType FROM users', (err, rows) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err.message);
      process.exit(1);
    }
    
    console.log('\n📋 Usuários no banco de dados:\n');
    rows.forEach(user => {
      const badge = user.userType === 'adm_supremo' ? '👑' : user.userType === 'diretor' ? '📊' : '👤';
      console.log(`${badge} ID: ${user.id} | Email: ${user.email} | Nome: ${user.name} | Tipo: ${user.userType}`);
    });
    
    console.log('\n');
    process.exit(0);
  });
});
