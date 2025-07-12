@echo off
REM Backup do banco de dados para o pen drive D:\
set DATA=%date:~6,4%-%date:~3,2%-%date:~0,2%-%time:~0,2%%time:~3,2%
set ORIGEM="%~dp0..\falecidos.db"
set DESTINO="D:\backups\falecidos-backup-%DATA%.db"
if not exist "D:\backups" mkdir "D:\backups"
copy %ORIGEM% %DESTINO%
echo Backup salvo no pen drive em %DESTINO%
pause
