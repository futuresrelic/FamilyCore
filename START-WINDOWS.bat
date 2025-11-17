@echo off
echo ========================================
echo    FamilyCore - Starting Application
echo ========================================
echo.

echo [1/3] Starting Docker containers (backend + database)...
docker-compose up -d

echo.
echo [2/3] Waiting for backend to be ready...
timeout /t 10 /nobreak

echo.
echo [3/3] Backend is ready!
echo.
echo ========================================
echo    BACKEND STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend API: http://localhost:8000/docs
echo.
echo Next step:
echo 1. Open a NEW PowerShell window
echo 2. Run these commands:
echo    cd frontend
echo    npm start
echo.
echo Then press W to open in browser
echo.
echo Login credentials:
echo    Email: parent@example.com
echo    Password: password123
echo.
echo Press any key to view backend logs...
pause
docker-compose logs -f backend
