#!/bin/bash
# Smart Home Backend - Dependency Fix Script for Linux/Mac
# This script automatically fixes common dependency installation issues

echo "=================================================="
echo "🔧 Smart Home Backend - Dependency Fix"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py not found!"
    echo "Please run this script from the backend directory:"
    echo "cd backend"
    echo "bash fix-dependencies.sh"
    exit 1
fi

# Remove old virtual environment
echo "🗑️  Cleaning old virtual environment..."
rm -rf venv
rm -rf __pycache__
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true

# Create fresh virtual environment
echo "📦 Creating fresh virtual environment..."
python3 -m venv venv

if [ ! -d "venv" ]; then
    echo "❌ Error: Could not create virtual environment"
    exit 1
fi

# Activate virtual environment
echo "🚀 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip and setuptools
echo "⬆️  Upgrading pip, setuptools, and wheel..."
python -m pip install --upgrade pip setuptools wheel --quiet

# Install requirements
echo "📥 Installing dependencies..."
pip install --no-cache-dir -r requirements.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! All dependencies installed."
    echo ""
    echo "📋 Installed packages:"
    pip list | grep -E "Flask|paho|dotenv"
    echo ""
    echo "🚀 To start the backend, run:"
    echo "   source venv/bin/activate"
    echo "   python app.py"
    echo ""
else
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi
