// Rotas para logs
import express from 'express';
import { listarLogs, deletarLogsUltimas24h } from '../models/log.js';
const router = express.Router();

// Somente usuários Dev devem acessar (validação simples via query ou header)
router.get('/', async (req, res) => {
  // Exemplo: cargo enviado via header (ideal seria JWT, aqui é simples)
  const cargo = req.headers['x-cargo'] || '';
  if (cargo !== 'Dev') return res.status(403).json({ erro: 'Acesso negado' });
  try {
    const logs = await listarLogs();
    res.json(logs);
  } catch (e) {
    console.error('[ERRO AO BUSCAR LOGS]', e);
    res.status(500).json({ erro: 'Erro ao buscar logs', detalhe: e && e.message ? e.message : String(e) });
  }
});

// Rota para deletar logs das últimas 24 horas
router.delete('/dia', async (req, res) => {
  const cargo = req.headers['x-cargo'] || '';
  if (cargo !== 'Dev') return res.status(403).json({ erro: 'Acesso negado' });
  try {
    await deletarLogsUltimas24h();
    res.json({ ok: true });
  } catch (e) {
    console.error('[ERRO AO DELETAR LOGS 24H]', e);
    res.status(500).json({ erro: 'Erro ao deletar logs das últimas 24h', detalhe: e && e.message ? e.message : String(e) });
  }
});

export default router;
