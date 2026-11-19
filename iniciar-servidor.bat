@echo off
title Servidor Local - Site CIDHA / UFPA (MJSAL)
echo ==========================================================
echo   Iniciando Servidor Local - Site CIDHA (UFPA / MJSAL)
echo ==========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080
pause
