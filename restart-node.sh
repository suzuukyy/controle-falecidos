#!/bin/bash

# Parar o serviço Node.js atual
pm2 stop all

# Iniciar o backend
cd /node
cd backend
pm2 start npm --name "backend" -- start

# Reiniciar o frontend
cd /public_html
pm2 start npm --name "frontend" -- start
