import { db } from '../db.js';

export function getFalecidos() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM falecidos', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getFalecidoById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM falecidos WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function addFalecido(nome, idade, documento, foto, unidade, responsavel) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO falecidos (nome, idade, documento, status, foto, unidade, responsavel) VALUES (?, ?, ?, ?, ?, ?, ?)', [nome, idade, documento, 'Remoção', foto, unidade, responsavel], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, nome, idade, documento, status: 'Remoção', foto, unidade, responsavel });
    });
  });
}

export function updateStatus(id, status) {
  return new Promise((resolve, reject) => {
    console.log('[updateStatus] id:', id, 'novo status:', status);
    db.get('SELECT status FROM falecidos WHERE id = ?', [id], (err, row) => {
      if (err) { console.error('[updateStatus] Erro SELECT status:', err); return reject(err); }
      const etapaAnterior = row ? row.status : null;
      console.log('[updateStatus] Etapa anterior:', etapaAnterior);
      db.run('UPDATE falecidos SET status = ? WHERE id = ?', [status, id], function (err) {
        if (err) { console.error('[updateStatus] Erro UPDATE falecidos:', err); reject(err); }
        else {
          if (etapaAnterior) {
            console.log('[updateStatus] Fechando etapa anterior:', etapaAnterior);
            db.run('UPDATE etapas SET fim = CURRENT_TIMESTAMP WHERE falecido_id = ? AND etapa = ? AND fim IS NULL', [id, etapaAnterior], function (err3) {
              if (err3) { console.error('[updateStatus] Erro UPDATE etapas (fim):', err3); reject(err3); }
              else inserirNovaEtapa();
            });
          } else {
            inserirNovaEtapa();
          }
          function inserirNovaEtapa() {
            console.log('[updateStatus] Inserindo nova etapa:', status);
            db.run('INSERT INTO etapas (falecido_id, etapa, inicio) VALUES (?, ?, CURRENT_TIMESTAMP)', [id, status], function (err2) {
              if (err2) { console.error('[updateStatus] Erro INSERT etapas:', err2); reject(err2); }
              else {
                console.log('[updateStatus] Nova etapa registrada com sucesso!');
                resolve({ id, status });
              }
            });
          }
        }
      });
    });
  });
}



export function getHistorico(id) {
  return new Promise((resolve, reject) => {
    db.all('SELECT etapa, inicio, fim FROM etapas WHERE falecido_id = ? ORDER BY inicio', [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Iniciar manualmente uma etapa
export function iniciarEtapa(falecidoId, etapa) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO etapas (falecido_id, etapa, inicio) VALUES (?, ?, CURRENT_TIMESTAMP)', [falecidoId, etapa], function (err) {
      if (err) reject(err);
      else resolve({ falecidoId, etapa, inicio: new Date().toISOString() });
    });
  });
}

// Parar manualmente uma etapa
export function pararEtapa(falecidoId, etapa) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE etapas SET fim = CURRENT_TIMESTAMP WHERE falecido_id = ? AND etapa = ? AND fim IS NULL', [falecidoId, etapa], function (err) {
      if (err) reject(err);
      else resolve({ falecidoId, etapa, fim: new Date().toISOString() });
    });
  });
}


export function deleteFalecido(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM etapas WHERE falecido_id = ?', [id], function (err) {
      if (err) reject(err);
      else {
        db.run('DELETE FROM falecidos WHERE id = ?', [id], function (err2) {
          if (err2) reject(err2);
          else resolve();
        });
      }
    });
  });
}

db.run(`CREATE TABLE IF NOT EXISTS falecidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  idade INTEGER,
  documento TEXT,
  status TEXT,
  foto TEXT,
  unidade TEXT,
  responsavel TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
