import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./falecidos.db');

db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT UNIQUE,
  senha TEXT,
  telefone TEXT,
  email TEXT,
  cargo TEXT
)`);

db.run(
  `INSERT INTO usuarios (nome, senha, telefone, email, cargo) VALUES (?, ?, ?, ?, ?)
   ON CONFLICT(nome) DO UPDATE SET senha=excluded.senha, telefone=excluded.telefone, email=excluded.email, cargo=excluded.cargo`,
  ['admin', 'admin123', '999999999', 'admin@email.com', 'Dev'],
  function (err) {
    if (err) {
      console.error('Erro ao criar/atualizar usuário admin:', err.message);
    } else {
      console.log('Usuário admin criado/atualizado com sucesso!');
    }
    db.close();
  }
);
