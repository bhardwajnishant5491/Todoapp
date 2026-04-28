@echo off
echo.
echo ========================================
echo   KISSANCONNECT - MongoDB Test
echo ========================================
echo.

cd backend

echo [1/3] Testing MongoDB Connection...
echo.
call npm run test-db

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! MongoDB is working
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Start backend: npm run dev
    echo 2. Start frontend: cd ../frontend ^&^& npm run dev
    echo 3. Login and test crop listing
    echo.
) else (
    echo.
    echo ========================================
    echo   FAILED! Check MongoDB Atlas settings
    echo ========================================
    echo.
    echo Troubleshooting:
    echo 1. Go to MongoDB Atlas Network Access
    echo 2. Add IP: 0.0.0.0/0 (Allow all)
    echo 3. Verify database credentials in .env
    echo 4. Check if cluster is paused
    echo.
)

pause
