import { db } from '../db.js';

export function getUsuarios() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, nome, IFNULL(telefone, "" ) as telefone, IFNULL(email, "") as email, IFNULL(cargo, "") as cargo FROM usuarios', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function addUsuario(nome, senha, telefone, email, cargo) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO usuarios (nome, senha, telefone, email, cargo) VALUES (?, ?, ?, ?, ?)', [nome || '', senha || '', telefone || '', email || '', cargo || ''], function (err) {
      if (err) reject(err);
      else {
        db.get('SELECT id, nome, telefone, email, cargo, senha FROM usuarios WHERE id = ?', [this.lastID], (err2, row) => {
          if (err2) reject(err2);
          else {
            console.log('[NOVO USUÁRIO CADASTRADO]', row);
            resolve(row);
          }
        });
      }
    });
  });
}

// Cria a tabela se não existir
export function initUsuarios() {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT UNIQUE,
    senha TEXT,
    telefone TEXT,
    email TEXT,
    cargo TEXT
  )`);
}
