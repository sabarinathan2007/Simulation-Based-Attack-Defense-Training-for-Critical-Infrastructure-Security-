#!/bin/bash
# Smart Home Cybersecurity Training Platform - Setup Script

echo "🏠 Smart Home Cybersecurity Training Platform Setup"
echo "=================================================="
echo ""

# Check for required tools
echo "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+"
    exit 1
fi

echo "✓ All prerequisites installed"
echo ""

# Start MQTT Broker
echo "Starting MQTT Broker (Mosquitto)..."
docker-compose up -d mosquitto

if [ $? -eq 0 ]; then
    echo "✓ MQTT Broker started"
else
    echo "❌ Failed to start MQTT Broker"
    exit 1
fi

# Wait for MQTT to be ready
echo "Waiting for MQTT broker to be ready..."
sleep 3

echo ""
echo "Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt --quiet

echo "✓ Backend setup complete"

cd ..
echo ""
echo "Setting up Frontend..."
cd frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install --quiet
fi

echo "✓ Frontend setup complete"

cd ..
echo ""
echo "=================================================="
echo "✓ Setup Complete!"
echo "=================================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start Backend (in one terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "2. Start Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open Browser:"
echo "   http://localhost:3000"
echo ""
echo "4. Login with:"
echo "   Username: user1"
echo "   Password: demo"
echo ""
echo "📚 Services Running:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:5000"
echo "   - MQTT Broker: localhost:1883 (MQTT) / 9001 (WebSocket)"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down"
echo ""
echo "Happy Learning! 🔒"
