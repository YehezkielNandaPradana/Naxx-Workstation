@echo off
setlocal enabledelayedexpansion
title Hermes Dashboard - Naxx Workstation

cd /d "%~dp0"
if exist "hermes-dashboard" cd /d "%~dp0hermes-dashboard"

echo ========================================================
echo   Hermes Dashboard - Naxx Workstation
echo ========================================================
echo.

rem Cek apakah dashboard sudah berjalan di port 3000
curl -s http://127.0.0.1:3000/api/sessions >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Hermes Dashboard sudah aktif berjalan di http://localhost:3000!
    echo [*] Membuka browser...
    start http://localhost:3000
    timeout /t 2 >nul
    exit /b 0
)

rem Jika belum jalan, periksa ketersediaan port
set PORT=3000
netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul
if !errorlevel! equ 0 (
    echo [i] Port 3000 dipakai proses lain, mencoba port 3100...
    set PORT=3100
)

echo [*] Menjalankan Hermes Dashboard di http://localhost:%PORT% ...
echo [*] Membuka browser otomatis...
start http://localhost:%PORT%
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

echo [ERROR] server-entry.js tidak ditemukan!
pause

:finished
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server berhenti dengan exit code %errorlevel%.
)
echo.
pause
