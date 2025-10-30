@echo off
REM Smart Home Backend - Automated Startup Script
REM This script does everything: test, verify, and start the backend

echo.
echo ============================================================
echo 🚀 Smart Home Backend - Automated Startup
echo ============================================================
echo.

REM Check if we're in backend directory
if not exist "app.py" (
    echo ❌ Error: app.py not found!
    echo Please run this from the backend directory:
    echo   cd backend
    echo   startup.bat
    pause
    exit /b 1
)

REM Step 1: Check Python
echo [STEP 1/5] Checking Python installation...
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Python not found!
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo ✅ Python is installed

REM Step 2: Check Virtual Environment
echo.
echo [STEP 2/5] Checking virtual environment...
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
)
echo ✅ Virtual environment ready

REM Step 3: Activate Virtual Environment
echo.
echo [STEP 3/5] Activating virtual environment...
call venv\Scripts\activate.bat
echo ✅ Virtual environment activated

REM Step 4: Test System
echo.
echo [STEP 4/5] Running system tests...
python test-system.py
if %ERRORLEVEL% neq 0 (
    echo ❌ System tests failed!
    pause
    exit /b 1
)

REM Step 5: Start Backend
echo.
echo [STEP 5/5] Starting Flask backend...
echo.
echo ============================================================
echo ✅ Backend is starting...
echo ============================================================
echo.
echo 📡 Backend URL: http://127.0.0.1:5000
echo 🔗 Health Check: http://127.0.0.1:5000/health
echo.
echo 💡 IMPORTANT:
echo    1. Make sure MQTT broker is running in another terminal:
echo       docker-compose up -d mosquitto
echo    2. Keep this terminal running
echo    3. Open new terminal for frontend:
echo       cd frontend && npm start
echo    4. Access web interface at http://localhost:3000
echo.
echo Press CTRL+C to stop the backend
echo.
echo ============================================================
echo.

python app.py
