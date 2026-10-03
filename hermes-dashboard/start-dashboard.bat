@echo off
title Hermes Dashboard - Naxx Workstation
cd /d %~dp0
echo Starting Hermes Dashboard on http://localhost:3100 ...
npm run dev
pause
