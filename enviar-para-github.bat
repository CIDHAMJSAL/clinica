@echo off
title Enviar Site para o GitHub - CIDHA / MJSAL
echo ==========================================================
echo   Enviando alteracoes para o GitHub
echo   Repositorio: https://github.com/CIDHAMJSAL/clinica.git
echo   Email: mjsalcidha@gmail.com
echo ==========================================================
echo.
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCESSO] O site foi enviado com sucesso para o repositorio GitHub!
) else (
    echo [AVISO] Se solicitou login, entre com a sua conta GitHub do projeto.
)
echo.
pause
