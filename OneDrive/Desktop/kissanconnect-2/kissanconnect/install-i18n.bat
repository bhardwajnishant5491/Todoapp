@echo off
echo ============================================
echo Installing i18n Dependencies for KisanConnect
echo ============================================
echo.

cd frontend

echo Installing i18next packages...
call npm install i18next react-i18next i18next-browser-languagedetector

echo.
echo ============================================
echo Installation Complete!
echo ============================================
echo.
echo The following packages have been installed:
echo - i18next
echo - react-i18next  
echo - i18next-browser-languagedetector
echo.
echo You can now use bilingual support (English/Hindi) in your app!
echo Language switcher is available in the top-right corner of navbar.
echo.
echo See LANGUAGE_GUIDE.md for usage instructions.
echo.
pause
