import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./falecidos.db');

db.serialize(() => {
  db.run('ALTER TABLE falecidos ADD COLUMN unidade TEXT', err => {
    if (err && !String(err.message).includes('duplicate')) {
      console.error('Erro ao adicionar coluna unidade:', err.message);
    } else {
      console.log('Coluna unidade adicionada (ou já existia)');
    }
  });
  db.run('ALTER TABLE falecidos ADD COLUMN responsavel TEXT', err => {
    if (err && !String(err.message).includes('duplicate')) {
      console.error('Erro ao adicionar coluna responsavel:', err.message);
    } else {
      console.log('Coluna responsavel adicionada (ou já existia)');
    }
  });
});

db.close();
