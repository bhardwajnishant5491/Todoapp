@echo off
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║         🌾 KISANCONNECT - System Health Check              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/5] Checking Backend Server...
curl -s http://localhost:5000/health > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend is running on http://localhost:5000
) else (
    echo ❌ Backend is NOT running
    echo    Start with: cd backend ^&^& npm run dev
)
echo.

echo [2/5] Checking Frontend Server...
curl -s http://localhost:5173 > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend is running on http://localhost:5173
) else (
    echo ❌ Frontend is NOT running
    echo    Start with: cd frontend ^&^& npm run dev
)
echo.

echo [3/5] Testing API Health...
curl -s http://localhost:5000/health
echo.

echo [4/5] Testing Crops Endpoint...
curl -s http://localhost:5000/api/crops
echo.

echo [5/5] Checking MongoDB Connection...
cd backend
call npm run test-db
cd ..

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    Health Check Complete                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

pause
