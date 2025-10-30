@echo off
REM Smart Home Backend - Dependency Fix Script for Windows
REM This script automatically fixes common dependency installation issues

echo ==================================================
echo 🔧 Smart Home Backend - Dependency Fix
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "app.py" (
    echo ❌ Error: app.py not found!
    echo Please run this script from the backend directory:
    echo cd backend
    echo fix-dependencies.bat
    pause
    exit /b 1
)

REM Remove old virtual environment
echo 🗑️  Cleaning old virtual environment...
if exist "venv" (
    rmdir /s /q venv
)
if exist "__pycache__" (
    rmdir /s /q __pycache__
)

REM Create fresh virtual environment
echo 📦 Creating fresh virtual environment...
python -m venv venv

if not exist "venv" (
    echo ❌ Error: Could not create virtual environment
    pause
    exit /b 1
)

REM Activate virtual environment
echo 🚀 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip and setuptools
echo ⬆️  Upgrading pip, setuptools, and wheel...
python -m pip install --upgrade pip setuptools wheel

REM Install requirements
echo 📥 Installing dependencies...
pip install --no-cache-dir -r requirements.txt

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ Success! All dependencies installed.
    echo.
    echo 📋 Installed packages:
    pip list | find /i "Flask"
    pip list | find /i "paho"
    pip list | find /i "dotenv"
    echo.
    echo 🚀 To start the backend, run:
    echo    venv\Scripts\activate
    echo    python app.py
    echo.
) else (
    echo ❌ Error: Failed to install dependencies
    pause
    exit /b 1
)

pause
