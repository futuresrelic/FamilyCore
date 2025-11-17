@echo off
echo ========================================
echo    FamilyCore - Starting Frontend
echo ========================================
echo.

echo Installing dependencies (first time only)...
call npm install

echo.
echo Starting Expo...
echo.
echo After it starts:
echo - Press W to open in web browser
echo - Or scan QR code with Expo Go app on your phone
echo.
echo ========================================

call npm start
