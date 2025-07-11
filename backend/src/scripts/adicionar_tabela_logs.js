// Script para criar tabela de logs se não existir
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./falecidos.db');

db.run(`CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT,
  acao TEXT,
  detalhes TEXT,
  data TEXT
)`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela logs:', err.message);
  } else {
    console.log('Tabela logs criada ou já existia.');
  }
  db.close();
  process.exit(0);
});
