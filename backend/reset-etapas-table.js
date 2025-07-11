// Script para resetar a tabela etapas do jeito certo
import { db } from './src/db.js';

function run(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function resetEtapas() {
  try {
    await run('DROP TABLE IF EXISTS etapas');
    await run(`CREATE TABLE etapas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      falecido_id INTEGER,
      etapa TEXT,
      inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
      fim DATETIME,
      FOREIGN KEY(falecido_id) REFERENCES falecidos(id)
    )`);
    console.log('Tabela etapas resetada e corrigida!');
  } catch (e) {
    console.error('Erro ao resetar tabela etapas:', e);
  } finally {
    process.exit(0);
  }
}

resetEtapas();
