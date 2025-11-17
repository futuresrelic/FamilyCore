@echo off
echo ========================================
echo    FamilyCore - Stopping Application
echo ========================================
echo.

echo Stopping Docker containers...
docker-compose down

echo.
echo ========================================
echo    ALL STOPPED SUCCESSFULLY!
echo ========================================
echo.
echo To start again, run START-WINDOWS.bat
echo.
pause
