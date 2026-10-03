@echo off
setlocal enabledelayedexpansion
title Hermes Dashboard - Naxx Workstation

cd /d "%~dp0"
if exist "hermes-dashboard" cd /d "%~dp0hermes-dashboard"

echo ========================================================
echo   Hermes Dashboard - Naxx Workstation
echo ========================================================
echo.

rem Cari port yang belum terpakai (3000, 3100, 3200, 3300)
set PORT=3000
netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul
if !errorlevel! equ 0 (
    echo [i] Port 3000 sedang aktif oleh instance lain.
    set PORT=3100
    netstat -ano | findstr /R /C:":3100 .*LISTENING" >nul
    if !errorlevel! equ 0 (
        echo [i] Port 3100 juga aktif.
        set PORT=3200
        netstat -ano | findstr /R /C:":3200 .*LISTENING" >nul
        if !errorlevel! equ 0 (
            echo [i] Port 3200 aktif, beralih ke Port 3300.
            set PORT=3300
        )
    )
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
