import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./falecidos.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
  if (err) {
    console.error('Erro ao listar tabelas:', err.message);
  } else {
    console.log('Tabelas no banco falecidos.db:');
    rows.forEach(row => console.log('-', row.name));
  }
  db.close();
});
