#!/bin/bash

# Configurações do FTP
FTP_HOST="ftp.kinghost.net"
FTP_USER="seu_usuario_kinghost"
FTP_PASS="sua_senha_kinghost"

# Diretórios
FRONTEND_DIR="frontend/build"
BACKEND_DIR="backend"

# 1. Build do frontend
echo "Fazendo build do frontend..."
cd frontend
npm run build
cd ..

# 2. Subindo frontend para o diretório público
echo "Subindo frontend para o servidor..."
lftp -c "open -u $FTP_USER,$FTP_PASS $FTP_HOST; mirror -R $FRONTEND_DIR /public_html"

# 3. Subindo backend para o diretório node
echo "Subindo backend para o servidor..."
lftp -c "open -u $FTP_USER,$FTP_PASS $FTP_HOST; mirror -R $BACKEND_DIR /node"

# 4. Reiniciando o serviço Node.js no KingHost
echo "Reiniciando o serviço Node.js..."
lftp -c "open -u $FTP_USER,$FTP_PASS $FTP_HOST; put restart-node.sh -o /node/restart-node.sh"
lftp -c "open -u $FTP_USER,$FTP_PASS $FTP_HOST; chmod 755 /node/restart-node.sh"

# 5. Limpando arquivos temporários
echo "Limpando arquivos temporários..."
rm -rf frontend/build

echo "Deploy concluído!"
