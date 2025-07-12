#!/bin/bash

# Build do frontend
echo "Fazendo build do frontend..."
cd frontend
npm run build
cd ..

# Subindo frontend via FTP
echo "Subindo frontend para o servidor..."
ftp -n << EOF
open ftp.kinghost.net
user jeeferson27@gmail.com Jaqueline232@
binary
cd public_html
lcd frontend/build
put index.html
put asset-manifest.json
put logo-sao-francisco.png
put foto-generica.png
put -r static
bye
EOF

# Subindo backend via FTP
echo "Subindo backend para o servidor..."
ftp -n << EOF
open ftp.kinghost.net
user jeeferson27@gmail.com Jaqueline232@
binary
cd node
lcd backend
put package.json
put -r src
bye
EOF

# Reiniciando o Node.js no servidor
echo "Reiniciando o Node.js..."
ftp -n << EOF
open ftp.kinghost.net
user jeeferson27@gmail.com Jaqueline232@
binary
cd node
put restart.sh
bye
EOF

# Executando o restart no servidor
echo "Executando restart..."
ftp -n << EOF
open ftp.kinghost.net
user jeeferson27@gmail.com Jaqueline232@
binary
quote SITE EXEC /node/restart.sh
bye
EOF

echo "Deploy concluído!"
