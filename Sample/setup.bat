@echo off
REM Smart Home Cybersecurity Training Platform - Windows Setup Script

echo.
echo ====================================================
echo 🏠 Smart Home Cybersecurity Training Platform Setup
echo ====================================================
echo.

REM Check for Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not in PATH
    echo    Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo ✓ Docker found

REM Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo    Please install Python 3.8+ from: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo ✓ Python found

REM Check for Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo    Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

echo.
echo Starting MQTT Broker (Mosquitto)...
docker-compose up -d mosquitto

if %errorlevel% neq 0 (
    echo ❌ Failed to start MQTT Broker
    pause
    exit /b 1
)
echo ✓ MQTT Broker started

REM Wait for MQTT to be ready
timeout /t 3 /nobreak

echo.
echo Setting up Backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt -q

echo ✓ Backend setup complete

cd ..
echo.
echo Setting up Frontend...
cd frontend

REM Install Node dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing Node dependencies...
    call npm install -q
)

echo ✓ Frontend setup complete

cd ..
echo.
echo ====================================================
echo ✓ Setup Complete!
echo ====================================================
echo.
echo 📋 Next Steps:
echo.
echo 1. Start Backend (open new Command Prompt):
echo    cd backend
echo    venv\Scripts\activate.bat
echo    python app.py
echo.
echo 2. Start Frontend (open another Command Prompt):
echo    cd frontend
echo    npm start
echo.
echo 3. Open Browser:
echo    http://localhost:3000
echo.
echo 4. Login with:
echo    Username: user1
echo    Password: demo
echo.
echo 📚 Services Running:
echo    - Frontend: http://localhost:3000
echo    - Backend: http://localhost:5000
echo    - MQTT Broker: localhost:1883 (MQTT) / 9001 (WebSocket)
echo.
echo 🛑 To stop services:
echo    docker-compose down
echo.
echo Happy Learning! 🔒
echo.

pause
