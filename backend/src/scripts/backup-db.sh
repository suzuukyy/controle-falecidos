#!/bin/bash
# Script de backup do banco SQLite
DATA=$(date +%Y-%m-%d-%H%M)
ORIGEM="$(dirname "$0")/../falecidos.db"
DESTINO="$(dirname "$0")/../backups/falecidos-backup-$DATA.db"
mkdir -p "$(dirname "$DESTINO")"
cp "$ORIGEM" "$DESTINO"
echo "Backup gerado em $DESTINO"
