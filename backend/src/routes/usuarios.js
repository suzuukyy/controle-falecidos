import express from 'express';
import { getUsuarios, addUsuario } from '../models/usuario.js';
import { db } from '../db.js';
import { registrarLog } from '../models/log.js';

const router = express.Router();

// Login de usuário (simples, sem JWT)
router.post('/login', async (req, res) => {
  const { nome, senha } = req.body;
  if (!nome || !senha) return res.status(400).json({ erro: 'Nome e senha obrigatórios' });
  db.get('SELECT id, nome, telefone, email, cargo FROM usuarios WHERE nome = ? AND senha = ?', [nome, senha], async (err, row) => {
    if (err) return res.status(500).json({ erro: 'Erro no banco de dados' });
    if (!row) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    try {
      await registrarLog(row.nome, 'Login', `Usuário ${row.nome} (${row.cargo}) fez login`);
    } catch(e) { console.error('[ERRO AO LOGAR LOGIN]', e); }
    res.json(row);
  });
});

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const lista = await getUsuarios();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Adicionar usuário
router.post('/', async (req, res) => {
  try {
    const { nome, senha, telefone, email, cargo } = req.body;
    if (!nome || !senha || !telefone || !email || !cargo) return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    const novo = await addUsuario(nome, senha, telefone, email, cargo);
    // Garante que retorna todos os campos igual ao getUsuarios
    res.status(201).json({
      id: novo.id,
      nome: novo.nome,
      telefone: novo.telefone,
      email: novo.email,
      cargo: novo.cargo
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Excluir usuário
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ erro: 'ID obrigatório' });
    db.run('DELETE FROM usuarios WHERE id = ?', [id], function (err) {
      if (err) {
        console.error('[ERRO AO EXCLUIR USUÁRIO]', err);
        return res.status(500).json({ erro: err.message });
      }
      if (this.changes === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
      res.json({ sucesso: true });
    });
  } catch (err) {
    console.error('[ERRO AO EXCLUIR USUÁRIO - CATCH]', err);
    res.status(500).json({ erro: err.message });
  }
});

export default router;
