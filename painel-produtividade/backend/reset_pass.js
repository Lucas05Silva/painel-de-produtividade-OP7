import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const [, , email, newPass] = process.argv;
if (!email || !newPass) {
  console.error('Uso: node reset_pass.js <email> <novaSenha>');
  process.exit(1);
}

const DB_PATH = join(__dirname, 'database.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao abrir DB:', err.message);
    process.exit(1);
  }
});

(async () => {
  try {
    const hashed = await bcrypt.hash(newPass, 10);
    db.run('UPDATE users SET password = ? WHERE email = ?', [hashed, email], function(err) {
      if (err) {
        console.error('Erro ao atualizar senha:', err.message);
        process.exit(1);
      }
      if (this.changes === 0) {
        console.error('Nenhum usuário encontrado com o email informado');
        process.exit(1);
      }
      console.log('Senha atualizada para', email);
      process.exit(0);
    });
  } catch (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  }
})();
