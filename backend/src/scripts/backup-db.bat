@echo off
REM Script de backup do banco SQLite para Windows
set DATA=%date:~6,4%-%date:~3,2%-%date:~0,2%-%time:~0,2%%time:~3,2%
set ORIGEM="..\falecidos.db"
set DESTINO="..\backups\falecidos-backup-%DATA%.db"
if not exist "..\backups" mkdir "..\backups"
copy %ORIGEM% %DESTINO%
echo Backup gerado em %DESTINO%
pause
