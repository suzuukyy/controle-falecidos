import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router();

// Caminho do arquivo de placas (pode ser um JSON simples)
const PLACAS_PATH = path.join(__dirname, '../../carros.json');

function lerPlacas() {
  if (!fs.existsSync(PLACAS_PATH)) return [];
  return JSON.parse(fs.readFileSync(PLACAS_PATH, 'utf8'));
}

function salvarPlacas(placas) {
  fs.writeFileSync(PLACAS_PATH, JSON.stringify(placas, null, 2));
}

// Listar todas as placas
router.get('/', (req, res) => {
  res.json(lerPlacas());
});

// Cadastrar nova placa
router.post('/', (req, res) => {
  const { placa } = req.body;
  if (!placa) return res.status(400).json({ erro: 'Placa obrigatória' });
  let placas = lerPlacas();
  if (placas.includes(placa)) return res.status(400).json({ erro: 'Placa já cadastrada' });
  placas.push(placa);
  salvarPlacas(placas);
  res.json({ ok: true, placa });
});

// Remover placa
router.delete('/:placa', (req, res) => {
  const { placa } = req.params;
  let placas = lerPlacas();
  placas = placas.filter(p => p !== placa);
  salvarPlacas(placas);
  res.json({ ok: true });
});

export default router;
