#!/bin/bash
# Build do frontend
npm run build

# Copiar arquivos para pasta do servidor
rsync -av build/* /caminho/no/servidor/kinghost/

# Reiniciar servidor Apache
service apache2 restart
