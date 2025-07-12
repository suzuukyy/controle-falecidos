#!/bin/bash

# Parar o serviço Node.js atual
pm2 stop all

# Entrar no diretório do backend
cd /node/backend

# Instalar dependências
npm install

# Iniciar o backend
pm2 start npm --name "backend" -- start

# Entrar no diretório do frontend
cd /public_html

# Iniciar o frontend
pm2 start npm --name "frontend" -- start
