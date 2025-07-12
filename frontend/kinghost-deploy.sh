#!/bin/bash

# Build do frontend
npm run build

# Configurações do FTP
FTP_HOST="ftp.kinghost.net"
FTP_USER="seu_usuario_kinghost"
FTP_PASS="sua_senha_kinghost"
FTP_DIR="public_html"

# Comando para subir os arquivos via FTP
lftp -c "open -u $FTP_USER,$FTP_PASS $FTP_HOST; mirror -R build/ $FTP_DIR/"
