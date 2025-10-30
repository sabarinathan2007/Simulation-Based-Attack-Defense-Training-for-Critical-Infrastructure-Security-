#!/bin/bash
# Smart Home Backend - Automated Startup Script
# This script does everything: test, verify, and start the backend

echo ""
echo "============================================================"
echo "🚀 Smart Home Backend - Automated Startup"
echo "============================================================"
echo ""

# Check if we're in backend directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py not found!"
    echo "Please run this from the backend directory:"
    echo "  cd backend"
    echo "  bash startup.sh"
    exit 1
fi

# Step 1: Check Python
echo "[STEP 1/5] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found!"
    echo "Please install Python 3.8+ from https://www.python.org/downloads/"
    exit 1
fi
echo "✅ Python is installed"
python3 --version

# Step 2: Check Virtual Environment
echo ""
echo "[STEP 2/5] Checking virtual environment..."
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
fi
echo "✅ Virtual environment ready"

# Step 3: Activate Virtual Environment
echo ""
echo "[STEP 3/5] Activating virtual environment..."
source venv/bin/activate
echo "✅ Virtual environment activated"

# Step 4: Test System
echo ""
echo "[STEP 4/5] Running system tests..."
python test-system.py
if [ $? -ne 0 ]; then
    echo "❌ System tests failed!"
    exit 1
fi

# Step 5: Start Backend
echo ""
echo "[STEP 5/5] Starting Flask backend..."
echo ""
echo "============================================================"
echo "✅ Backend is starting..."
echo "============================================================"
echo ""
echo "📡 Backend URL: http://127.0.0.1:5000"
echo "🔗 Health Check: http://127.0.0.1:5000/health"
echo ""
echo "💡 IMPORTANT:"
echo "   1. Make sure MQTT broker is running in another terminal:"
echo "      docker-compose up -d mosquitto"
echo "   2. Keep this terminal running"
echo "   3. Open new terminal for frontend:"
echo "      cd frontend && npm start"
echo "   4. Access web interface at http://localhost:3000"
echo ""
echo "Press CTRL+C to stop the backend"
echo ""
echo "============================================================"
echo ""

python app.py
