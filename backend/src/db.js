import sqlite3 from 'sqlite3';
import { initUsuarios } from './models/usuario.js';

export const db = new sqlite3.Database('./falecidos.db');

export function initDb() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS falecidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      idade INTEGER,
      documento TEXT,
      status TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS etapas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      falecido_id INTEGER,
      etapa TEXT,
      inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
      fim DATETIME,
      FOREIGN KEY(falecido_id) REFERENCES falecidos(id)
    )`);
    // Garante que a tabela usuarios seja criada junto
    initUsuarios();
  });
}
