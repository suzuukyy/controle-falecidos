// Script para garantir que a tabela etapas possui as colunas corretas (inicio, fim)
import { db } from './src/db.js';

function run(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function fixEtapas() {
  try {
    // Renomear tabela antiga se existir
    await run('ALTER TABLE etapas RENAME TO etapas_old');
  } catch (e) {
    // Se não existe, ignora
  }
  // Cria nova tabela com as colunas corretas
  await run(`CREATE TABLE IF NOT EXISTS etapas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    falecido_id INTEGER,
    etapa TEXT,
    inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fim DATETIME,
    FOREIGN KEY(falecido_id) REFERENCES falecidos(id)
  )`);
  // Não migra dados antigos para evitar erro de coluna
  console.log('Tabela etapas corrigida!');
  process.exit(0);
}

fixEtapas();
