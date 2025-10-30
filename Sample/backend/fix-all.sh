#!/bin/bash
# Smart Home Backend - Complete Fix Script (Linux/Mac)
# Solves all dependency issues including paho-mqtt version problem

echo "=================================================="
echo "🔧 Smart Home Backend - Complete Dependency Fix"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py not found!"
    echo "Please run this script from the backend directory:"
    echo "cd backend"
    echo "bash fix-all.sh"
    exit 1
fi

# Step 1: Clean everything
echo "[1/5] 🗑️  Cleaning old files..."
rm -rf venv
rm -rf __pycache__
rm -f smart_home_logs.db
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true

# Step 2: Create fresh virtual environment
echo "[2/5] 📦 Creating fresh virtual environment..."
python3 -m venv venv

if [ ! -d "venv" ]; then
    echo "❌ Error: Could not create virtual environment"
    echo "Make sure Python 3.8+ is installed"
    exit 1
fi

# Step 3: Activate virtual environment
echo "[3/5] 🚀 Activating virtual environment..."
source venv/bin/activate

# Step 4: Upgrade pip and install base tools
echo "[4/5] ⬆️  Upgrading pip and setuptools..."
python -m pip install --upgrade pip setuptools wheel --quiet

# Step 5: Install requirements
echo "[5/5] 📥 Installing dependencies..."
echo ""
echo "Installing: Flask, Flask-CORS, Flask-Session, paho-mqtt 2.1.0, python-dotenv"
echo ""
pip install --no-cache-dir -r requirements.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "============================================================"
    echo "✅ SUCCESS! All dependencies installed correctly!"
    echo "============================================================"
    echo ""
    echo "📋 Installed packages:"
    pip list | grep -E "Flask|paho|dotenv"
    echo ""
    echo "✅ Verifying installation..."
    python verify-dependencies.py
    echo ""
    echo "🚀 To start the backend, run:"
    echo "   python app.py"
    echo ""
    echo "🎉 Setup complete! Backend is ready to use."
    echo ""
else
    echo ""
    echo "❌ ERROR: Installation failed!"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "1. Make sure you have Python 3.8+ installed"
    echo "2. Check your internet connection"
    echo "3. Try: pip install paho-mqtt==2.1.0 (manually)"
    echo ""
    exit 1
fi
