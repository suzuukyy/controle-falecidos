// Script para adicionar colunas 'inicio' e 'fim' na tabela etapas, caso não existam
import { db } from './src/db.js';

function addColumnIfNotExists(table, column, type) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${table})`, (err, columns) => {
      if (err) return reject(err);
      const exists = Array.isArray(columns) && columns.some(r => r.name === column);
      if (exists) return resolve(false);
      db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`, err2 => {
        if (err2) reject(err2);
        else resolve(true);
      });
    });
  });
}

(async () => {
  try {
    const addedInicio = await addColumnIfNotExists('etapas', 'inicio', 'DATETIME');
    const addedFim = await addColumnIfNotExists('etapas', 'fim', 'DATETIME');
    if (addedInicio) console.log("Coluna 'inicio' adicionada à tabela etapas.");
    if (addedFim) console.log("Coluna 'fim' adicionada à tabela etapas.");
    if (!addedInicio && !addedFim) console.log('Nada a migrar. Estrutura já está correta.');
    process.exit(0);
  } catch (e) {
    console.error('Erro ao migrar tabela etapas:', e);
    process.exit(1);
  }
})();
