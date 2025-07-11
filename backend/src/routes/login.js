import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Login: POST /api/login { usuario, senha }
router.post('/', (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) return res.status(400).json({ erro: 'Usuário e senha obrigatórios' });
  db.get('SELECT * FROM usuarios WHERE nome = ? AND senha = ?', [usuario, senha], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (!row) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }
    // Sucesso: retorna dados mínimos do usuário
    res.json({ id: row.id, nome: row.nome, cargo: row.cargo });
  });
});

export default router;
