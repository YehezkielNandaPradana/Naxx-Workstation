@echo off
setlocal enabledelayedexpansion
title Hermes Dashboard - Naxx Workstation

cd /d "%~dp0"
if exist "hermes-dashboard" cd /d "%~dp0hermes-dashboard"

echo ========================================================
echo   Hermes Dashboard - Naxx Workstation
echo ========================================================

rem Deteksi apakah port 3000 sedang dipakai
set PORT=3000
netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul
if %errorlevel% equ 0 (
    echo [i] Port 3000 sedang dipakai oleh hermes-workspace.
    echo [*] Mengalihkan Hermes Dashboard ke Port 3100...
    set PORT=3100
)

echo [*] Menjalankan Hermes Dashboard di http://127.0.0.1:%PORT% ...
echo [*] Tekan Ctrl+C untuk menghentikan server.
echo.

if exist "server-entry.js" (
    node server-entry.js
    goto finished
)

if exist "node_modules" (
    call pnpm start
    goto finished
)

echo [ERROR] server-entry.js atau node_modules tidak ditemukan!
pause

:finished
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server berhenti dengan exit code %errorlevel%.
)
echo.
pause
