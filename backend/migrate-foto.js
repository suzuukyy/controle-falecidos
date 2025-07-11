import { db } from './src/db.js';

db.run('ALTER TABLE falecidos ADD COLUMN foto TEXT', (err) => {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('A coluna foto já existe!');
    } else {
      console.error('Erro ao adicionar coluna foto:', err.message);
    }
  } else {
    console.log('Coluna foto adicionada com sucesso!');
  }
  db.close();
});
