// Model para logs de ações dos usuários
import { db } from '../db.js';

function registrarLog(usuario, acao, detalhes) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO logs (usuario, acao, detalhes, data) VALUES (?, ?, ?, ?)',
      [usuario, acao, detalhes, new Date().toISOString()],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
  });
}

function listarLogs() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM logs ORDER BY data DESC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function deletarLogsUltimas24h() {
  return new Promise((resolve, reject) => {
    const agora = new Date();
    const limite = new Date(agora.getTime() - 24*60*60*1000);
    const limiteISO = limite.toISOString();
    db.run('DELETE FROM logs WHERE data >= ?', [limiteISO], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

export { registrarLog, listarLogs, deletarLogsUltimas24h };
