import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import falecidosRouter from './routes/falecidos.js';
import usuariosRouter from './routes/usuarios.js';
import loginRouter from './routes/login.js';
import logsRouter from './routes/logs.js';
import { initDb } from './db.js';
import { initUsuarios } from './models/usuario.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

initDb();
initUsuarios();

app.use('/api/falecidos', falecidosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/login', loginRouter);
app.use('/api/logs', logsRouter);

app.get('/', (req, res) => {
  res.send('API de Falecidos rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
