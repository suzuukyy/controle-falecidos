import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getFalecidos, getFalecidoById, addFalecido, updateStatus, getHistorico, deleteFalecido, iniciarEtapa, pararEtapa } from '../models/falecido.js';
import { registrarLog } from '../models/log.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../../uploads') });

// Listar todos os falecidos
router.get('/', async (req, res) => {
  try {
    const lista = await getFalecidos();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Adicionar novo falecido
router.post('/', upload.single('foto'), async (req, res) => {
  let usuario = {};
  try {
    usuario = JSON.parse(req.headers['x-usuario']||'{}');
  } catch {}

  try {
    console.log('REQ.BODY:', req.body);
    console.log('REQ.FILE:', req.file);
    const { nome, idade, documento, unidade, responsavel } = req.body;
    let fotoPath = null;
    if (req.file) {
      fotoPath = req.file.filename;
      console.log('Foto salva como:', fotoPath);
    }
    const novo = await addFalecido(nome, idade, documento, fotoPath, unidade, responsavel);
    console.log('Novo falecido salvo:', novo);
    // Logar ação
    try { await registrarLog(usuario.nome||'Desconhecido', 'Cadastro de falecido', `Nome: ${nome}`); } catch(e){}
    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao cadastrar falecido:', err);
    res.status(500).json({ erro: err.message });
  }
});

// Servir foto do falecido
router.get('/:id/foto', async (req, res) => {
  try {
    const falecido = await getFalecidoById(req.params.id);
    if (!falecido || !falecido.foto) return res.status(404).send('Foto não encontrada');
    const fotoPath = path.join(__dirname, '../../uploads', falecido.foto);
    if (!fs.existsSync(fotoPath)) return res.status(404).send('Arquivo não encontrado');
    res.sendFile(fotoPath);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar status (etapa)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const atualizado = await updateStatus(req.params.id, status);
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Histórico de etapas
router.get('/:id/historico', async (req, res) => {
  try {
    const lista = await getHistorico(req.params.id);
    // Garantir que inicio e fim estão presentes
    res.json(lista.map(et => ({
      ...et,
      inicio: et.inicio,
      fim: et.fim
    })));
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Iniciar manualmente uma etapa
router.post('/:id/etapas/:etapa/inicio', async (req, res) => {
  let usuario = {};
  try {
    usuario = JSON.parse(req.headers['x-usuario']||'{}');
  } catch {}

  try {
    const { id, etapa } = req.params;
    const result = await iniciarEtapa(id, etapa);
    // Logar ação de início de etapa
    try { await registrarLog(usuario.nome||'Desconhecido', 'Iniciou etapa', `ID: ${id}, Etapa: ${etapa}`); } catch(e){}
    res.json(result);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Parar manualmente uma etapa
router.post('/:id/etapas/:etapa/fim', async (req, res) => {
  let usuario = {};
  try {
    usuario = JSON.parse(req.headers['x-usuario']||'{}');
  } catch {}

  try {
    const { id, etapa } = req.params;
    const result = await pararEtapa(id, etapa);
    // Logar ação de parada de etapa
    try { await registrarLog(usuario.nome||'Desconhecido', 'Parou etapa', `ID: ${id}, Etapa: ${etapa}`); } catch(e){}
    res.json(result);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar falecido
router.delete('/:id', async (req, res) => {
  let usuario = {};
  try {
    usuario = JSON.parse(req.headers['x-usuario']||'{}');
  } catch {}

  try {
    await deleteFalecido(req.params.id);
    // Logar ação
    try { await registrarLog(usuario.nome||'Desconhecido', 'Exclusão de falecido', `ID: ${req.params.id}`); } catch(e){}
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
