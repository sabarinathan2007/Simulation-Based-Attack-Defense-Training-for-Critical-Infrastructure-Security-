# Smart Home Cybersecurity Training Platform - Complete Guide

**Version:** 1.0  
**Last Updated:** 2024  
**Purpose:** Interactive platform for learning cybersecurity in IoT/Smart Home systems

---

## 📑 TABLE OF CONTENTS

1. [Overview](#overview)
2. [What You'll Learn](#what-youll-learn)
3. [System Architecture](#system-architecture)
4. [Complete Installation Guide](#complete-installation-guide)
5. [How to Use the Platform](#how-to-use-the-platform)
6. [Security Features Explained](#security-features-explained)
7. [API Documentation](#api-documentation)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Project Files & Structure](#project-files--structure)
10. [Deployment & Production](#deployment--production)
11. [Testing Scenarios](#testing-scenarios)
12. [FAQs & Best Practices](#faqs--best-practices)

---

## 🎯 OVERVIEW

### What is This Platform?

This is an **interactive, web-based learning environment** where you can:
- ✅ Safely control simulated smart home devices (lights, thermostat, locks)
- ✅ Perform authorized operations through a secure dashboard
- ✅ Execute educational cyberattacks to understand
└────────┬─────────┘   │  • /devices/lock         │
         │             └──────────────────────────┘
         │
         ▼
┌──────────────────┐
│   SQLite DB      │
│  • Logs Table    │
│  • Attack Events │
│  • Device Events │
│  • Auth Events   │
└──────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (for MQTT broker)
- Python 3.8+ (for backend)
- Node.js 14+ (for React frontend)
- Git

### Installation & Setup

#### 1. Clone the Repository
```bash
cd /path/to/project
```

#### 2. Setup MQTT Broker (Docker)
```bash
# Start Mosquitto MQTT broker with Docker Compose
docker-compose up -d

# Verify broker is running
docker ps  # Should show 'smart_home_mqtt_broker'

# Check logs
docker-compose logs mosquitto
```

#### 3. Setup Backend (Flask)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask backend
python app.py
```

The backend will start on `http://localhost:5000`

#### 4. Setup Frontend (React)

```bash
# Open a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

The frontend will open at `http://localhost:3000`

### 5. Access the Application

1. Open `http://localhost:3000` in your browser
2. Login with any username and password "demo" (e.g., user1/demo)
3. Explore the dashboard and try the features!

---

## 📱 Features & Usage

### 🔐 Login Page
- Simple username/password authentication
- Demo accounts available:
  - **user1** - Full device access
  - **user2** - Limited device access
  - Any username with password "demo"

### 📊 Dashboard
- **System Status**: Connection status, active devices count
- **Active Devices**: Real-time device state monitoring
- **Security Alerts**: Recent attacks detected
- **Getting Started**: Quick guide to platform features

### 🔌 Device Controls
- **Safe Device Management**
  - Light controls (on/off)
  - Thermostat (temperature slider)
  - Smart lock (lock/unlock)
- All commands are authorized and logged
- Real-time state feedback

### ⚔️ Perform Attack (Educational)
Demonstrates cybersecurity attacks through MQTT:

1. **Unauthorized Device Control**
   - Bypasses backend authorization
   - Directly publishes to MQTT topic
   - System should detect and flag

2. **Authentication Bypass**
   - Attempts to bypass auth with special flags
   - Tests input validation

3. **Denial of Service (DoS)**
   - Rapid fire commands to device
   - Tests rate limiting

4. **Malformed Messages**
   - Invalid JSON/payload
   - Tests error handling

### 🛡️ Defense & Logs
- **Security Summary**: Attack count, total events, system status
- **Critical Alerts**: High-priority security warnings
- **Event Logs**: Detailed filterable logs of all activities
- **Log Types**:
  - ⚠️ ATTACK - Malicious/suspicious activity
  - 🛡️ DEFENSE - System response/alert
  - 🔌 DEVICE_UPDATE - Normal device commands
  - 🔐 AUTH - Login/session events

---

## 🔒 Security Features

### Attack Detection
The backend monitors MQTT messages for suspicious patterns:

1. **Attack Flag Detection**
   ```json
   {"action": "on", "attack": true}  // ❌ Detected as attack
   ```

2. **Auth Bypass Attempts**
   ```json
   {"action": "on", "bypass_auth": true}  // ❌ Detected
   ```

3. **Rapid Fire Commands**
   ```json
   {"action": "on", "rapid_fire": true}  // ❌ Detected as DoS
   ```

### Authorization Check
- Each user can only control assigned devices
- Backend validates user-device permission before publishing
- Unauthorized attempts are logged as security events

### Logging & Monitoring
- All events logged to SQLite database
- Real-time alert display
- Filter logs by type, device, severity
- Exportable audit trail

---

## 📝 API Documentation

### Authentication Endpoints

**POST /api/login**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "demo"}'
```

**POST /api/logout**
```bash
curl -X POST http://localhost:5000/api/logout
```

**GET /api/session**
```bash
curl http://localhost:5000/api/session
```

### Device Endpoints

**GET /api/devices**
```bash
curl http://localhost:5000/api/devices
```

**POST /api/control-device**
```bash
curl -X POST http://localhost:5000/api/control-device \
  -H "Content-Type: application/json" \
  -d '{"device": "light1", "action": "on"}'
```

### Log Endpoints

**GET /api/logs**
```bash
# Get all logs with optional filters
curl "http://localhost:5000/api/logs?limit=50&type=ATTACK&device=light1"
```

**GET /api/logs/attack**
```bash
# Get only attack logs
curl "http://localhost:5000/api/logs/attack?limit=10"
```

**POST /api/logs/clear**
```bash
curl -X POST http://localhost:5000/api/logs/clear
```

---

## 🛠️ Troubleshooting

### MQTT Connection Issues
```bash
# Check if Mosquitto is running
docker ps | grep mosquitto

# View Mosquitto logs
docker-compose logs mosquitto

# Restart Mosquitto
docker-compose restart mosquitto
```

### Flask Connection Refused
```bash
# Check if Flask is running
curl http://localhost:5000/health

# Ensure MQTT_BROKER is set correctly in app.py
# Use 'localhost' for local development, 'mosquitto' for Docker
```

### React Connection Issues
```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Check proxy in package.json points to correct backend URL
```

### Database Locked Error
```bash
# Delete the existing database
rm backend/smart_home_logs.db

# Restart Flask - it will create a new database
```

---

## 📚 Learning Objectives

This platform teaches:

### IoT & MQTT Concepts
- Message-oriented middleware (MQTT)
- Publish-subscribe model
- Topic-based communication
- Broker architecture

### Cybersecurity Topics
- **Authentication & Authorization**
  - User session management
  - Permission-based access control
  - Credential validation

- **Attack Vectors**
  - Unauthorized access attempts
  - Injection attacks
  - Denial of Service (DoS)
  - Malformed input handling

- **Defense Mechanisms**
  - Input validation
  - Rate limiting
  - Anomaly detection
  - Security logging & monitoring
  - Alert systems

- **IoT Security Challenges**
  - Resource-constrained devices
  - Network security
  - Device management at scale

### Practical Skills
- Working with MQTT brokers
- Secure API design
- Real-time data handling
- Security monitoring implementation

---

## 📂 Project Structure

```
smart-home-security-platform/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Docker configuration
│   └── smart_home_logs.db    # SQLite database (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js      # Login page
│   │   │   ├── Dashboard.js  # Dashboard with real-time updates
│   │   │   ├── Devices.js    # Device control panel
│   │   │   ├── Attack.js     # Attack simulation
│   │   │   └── Defense.js    # Logs and alerts
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # Styling
│   │   └── index.js          # React entry point
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── package.json          # Node dependencies
│   └── .env                  # Environment variables
│
├── docker-compose.yml        # Docker Compose configuration
├── mosquitto.conf           # MQTT broker configuration
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

---

## 🔧 Configuration

### Backend (app.py)
```python
# MQTT Configuration
MQTT_BROKER = 'localhost'  # Change to 'mosquitto' for Docker
MQTT_PORT = 1883
MQTT_WEBSOCKET_PORT = 9001

# Authorized Devices per User
AUTHORIZED_DEVICES = {
    'user1': ['light1', 'light2', 'thermostat', 'lock'],
    'user2': ['light1']
}
```

### Mosquitto (mosquitto.conf)
```
# MQTT Protocol
listener 1883
protocol mqtt

# WebSocket for browsers
listener 9001
protocol websockets

# Allow anonymous (for demo - use auth in production!)
allow_anonymous true
```

---

## 🚢 Deployment

### Docker Full Stack
```bash
# Build custom backend image
docker build -t smart-home-backend:latest ./backend

# Update docker-compose.yml to use custom image
# Uncomment the backend service section

# Start entire stack
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Production Considerations
- [ ] Enable MQTT authentication
- [ ] Use TLS/SSL encryption for MQTT
- [ ] Implement rate limiting
- [ ] Add proper user authentication (OAuth2, JWT)
- [ ] Use environment variables for secrets
- [ ] Implement input validation & sanitization
- [ ] Add database encryption
- [ ] Deploy behind reverse proxy (Nginx)
- [ ] Add monitoring & alerting
- [ ] Implement CORS restrictions

---

## 🧪 Testing the Platform

### Manual Test Scenario

1. **Setup**
   - Start all services (Docker, Flask, React)
   - Login with user1/demo

2. **Test Safe Operations**
   - Go to Device Controls
   - Toggle lights, adjust thermostat
   - Verify state changes in Dashboard

3. **Test Attack Detection**
   - Go to Perform Attack tab
   - Click "Execute Unauthorized Control"
   - Check Defense tab for attack log
   - Verify alert timestamp and message

4. **Test Multiple Attacks**
   - Try different attack types
   - Observe detection rate
   - Check logs for patterns

5. **Test Authorization**
   - Logout and login as user2
   - Try to control restricted devices
   - Verify access denied

---

## 📖 Code Comments

All code includes detailed comments explaining:
- Function purposes
- Parameter meanings
- Security considerations
- Expected behavior

Example from app.py:
```python
@app.route('/api/control-device', methods=['POST'])
def control_device():
    """
    Control a device via MQTT.
    Sends command to MQTT topic.
    """
```

---

## 🤝 Contributing

Improvements and extensions welcome! Ideas:
- Add more attack types
- Implement rate limiting
- Add data persistence
- Create advanced analytics dashboard
- Add device simulation backend
- Implement TLS encryption

---

## 📄 License

Educational platform for learning purposes. Use responsibly.

---

## ⚠️ Important Notes

1. **Educational Only**: This platform is designed for learning. Never use these techniques on systems you don't own.

2. **Insecure by Design**: Features like anonymous MQTT access are intentional for demonstration purposes. Don't use in production.

3. **Data Privacy**: This is a demo platform. Real systems require proper data protection and GDPR compliance.

4. **Security**: Always implement proper security in production systems, including:
   - TLS/SSL encryption
   - Strong authentication
   - Input validation
   - Rate limiting
   - Security monitoring

---

## 🆘 Support & Issues

If you encounter issues:

1. Check troubleshooting section
2. Review service logs:
   ```bash
   # Frontend errors - check browser console (F12)
   # Backend errors
   tail -f backend/app.log
   # MQTT errors
   docker-compose logs mosquitto
   ```

3. Ensure all services are running:
   ```bash
   # Check ports
   netstat -an | grep LISTEN
   # Should see 3000, 5000, 1883, 9001
   ```

---

## 🎓 Learning Resources

- **MQTT Protocol**: https://mqtt.org/
- **IoT Security**: https://www.iot-home.org/security/
- **OWASP IoT**: https://owasp.org/www-project-internet-of-things/
- **Flask Docs**: https://flask.palletsprojects.com/
- **React Docs**: https://react.dev/

---

**Happy Learning! Stay Secure! 🔒**
