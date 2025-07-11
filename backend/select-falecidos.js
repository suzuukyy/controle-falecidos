import { db } from './src/db.js';

db.all('SELECT * FROM falecidos', (err, rows) => {
  if (err) {
    console.error('Erro ao buscar falecidos:', err.message);
  } else {
    console.log('Falecidos cadastrados:');
    console.table(rows);
  }
  db.close();
});
