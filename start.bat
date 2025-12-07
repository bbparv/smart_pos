@echo off
echo ========================================
echo Smart POS - Quick Start
echo ========================================
echo.
echo This will start both backend and frontend servers.
echo.
echo Make sure you have:
echo 1. PostgreSQL running
echo 2. Database created and migrated
echo 3. Users created
echo.
echo See QUICKSTART.md for setup instructions.
echo.
pause
echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"
echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:4000/graphql
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
