@echo off
REM Smart Home Backend - Complete Fix Script (Windows)
REM Solves all dependency issues including paho-mqtt version problem

echo ==================================================
echo 🔧 Smart Home Backend - Complete Dependency Fix
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "app.py" (
    echo ❌ Error: app.py not found!
    echo Please run this script from the backend directory:
    echo cd backend
    echo fix-all.bat
    pause
    exit /b 1
)

REM Step 1: Clean everything
echo [1/5] 🗑️  Cleaning old files...
if exist "venv" rmdir /s /q venv
if exist "__pycache__" rmdir /s /q __pycache__
if exist "smart_home_logs.db" del /q smart_home_logs.db

REM Step 2: Create fresh virtual environment
echo [2/5] 📦 Creating fresh virtual environment...
python -m venv venv

if not exist "venv" (
    echo ❌ Error: Could not create virtual environment
    echo Make sure Python 3.8+ is installed
    pause
    exit /b 1
)

REM Step 3: Activate virtual environment
echo [3/5] 🚀 Activating virtual environment...
call venv\Scripts\activate.bat

REM Step 4: Upgrade pip and install base tools
echo [4/5] ⬆️  Upgrading pip and setuptools...
python -m pip install --upgrade pip setuptools wheel --quiet

REM Step 5: Install requirements
echo [5/5] 📥 Installing dependencies...
echo.
echo Installing: Flask, Flask-CORS, Flask-Session, paho-mqtt 2.1.0, python-dotenv
echo.
pip install --no-cache-dir -r requirements.txt

if %ERRORLEVEL% equ 0 (
    echo.
    echo ============================================================
    echo ✅ SUCCESS! All dependencies installed correctly!
    echo ============================================================
    echo.
    echo 📋 Installed packages:
    pip list | find /i "Flask"
    pip list | find /i "paho"
    pip list | find /i "dotenv"
    echo.
    echo ✅ Verifying installation...
    python verify-dependencies.py
    echo.
    echo 🚀 To start the backend, run:
    echo    python app.py
    echo.
    echo 🎉 Setup complete! Backend is ready to use.
    echo.
) else (
    echo.
    echo ❌ ERROR: Installation failed!
    echo.
    echo 🔍 Troubleshooting:
    echo 1. Make sure you have Python 3.8+ installed
    echo 2. Check your internet connection
    echo 3. Try: pip install paho-mqtt==2.1.0 (manually)
    echo.
    pause
    exit /b 1
)

pause
