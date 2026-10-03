@echo off
title Hermes Dashboard - Naxx Workstation
cd /d "%~dp0\hermes-dashboard"
echo Starting Hermes Dashboard on http://127.0.0.1:3000 ...
pnpm start
pause
