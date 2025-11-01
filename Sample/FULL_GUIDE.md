# Smart Home Cybersecurity Training Platform - FULL SETUP & USAGE GUIDE

**Version:** 1.0  
**Last Updated:** 2024  
**Purpose:** Complete step-by-step guide for deploying and using the Smart Home Cybersecurity Training Platform

---

## 🎯 TABLE OF CONTENTS

1. [Before You Start](#before-you-start)
2. [System Requirements](#system-requirements)
3. [Complete Installation Process](#complete-installation-process)
4. [Verifying Your Setup](#verifying-your-setup)
5. [Running the Platform](#running-the-platform)
6. [Using the Platform](#using-the-platform)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)
9. [Next Steps & Learning](#next-steps--learning)

---

## ⚠️ BEFORE YOU START

### What You're Building
You're setting up an interactive cybersecurity training platform with:
- **MQTT Message Broker** (Mosquitto) - Communication hub
- **Python Flask Backend** - API server & attack detection
- **React Frontend** - Web-based dashboard
- **SQLite Database** - Event logging & audit trail

### Time Required
- **First-time setup**: 20-30 minutes
- **Subsequent runs**: 2-3 minutes

### Important Notes
- This is an **educational platform** - never use on production systems
- All security features demonstrate **vulnerabilities by design** for learning
- Follow all steps in order for success

---

## 📋 SYSTEM REQUIREMENTS

### Required Software
- **Git** (for cloning repository)
- **Docker & Docker Compose** (for MQTT broker)
- **Python 3.8+** (for Flask backend)
- **Node.js 14+ & npm** (for React frontend)

### Recommended System
- **RAM**: 4GB minimum (8GB+ recommended)
- **Disk Space**: 2GB free
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)

### Ports Required (must be available)
- **3000** - React frontend
- **5000** - Flask backend
- **1883** - MQTT broker (standard)
- **9001** - MQTT WebSocket

### Verify Prerequisites Installed

```bash
# Check Python
python --version  # Should be 3.8 or higher

# Check Node.js
node --version    # Should be 14.x or higher
npm --version     # Should be 6.x or higher

# Check Docker
docker --version
docker-compose --version

# Check Git
git --version
```

**If any command fails**, install the missing software from:
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/
- Docker: https://docs.docker.com/get-docker/
- Git: https://git-scm.com/

---

## 🔧 COMPLETE INSTALLATION PROCESS

### PHASE 1: Project Setup (5 minutes)

#### Step 1: Navigate to Project Directory
```bash
cd "c:\Users\vnada\OneDrive\Documents\Cyber_Project\Simulation-Based-Attack-Defense-Training-for-Critical-Infrastructure-Security-\Sample"
```

#### Step 2: Verify Project Structure
Your project folder should contain:
```
Sample/
├── backend/              (Flask application)
├── frontend/             (React application)
├── docker-compose.yml    (MQTT configuration)
├── mosquitto.conf        (MQTT settings)
└── README.md            (Quick reference)
```

**If missing any folders**, extract them or clone the repository.

---

### PHASE 2: Start MQTT Broker (3 minutes)

The MQTT broker is the communication hub for all devices and messages.

#### Step 3: Start Docker Services
```bash
# From the project root directory
docker-compose up -d

# Verify it's running
docker ps

# You should see 'smart_home_mqtt_broker' running
```

#### Step 4: Verify MQTT is Running
```bash
# Check logs for any errors
docker-compose logs mosquitto

# Look for: "mosquitto version X.X.X ready"
```

**If MQTT fails to start:**
- Check if ports 1883 and 9001 are available
- Run `docker-compose logs mosquitto` for error messages
- See Troubleshooting section

---

### PHASE 3: Setup Backend (7 minutes)

The backend handles API requests, device control, and attack detection.

#### Step 5: Create Python Virtual Environment
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# You should see (venv) in your terminal
```

#### Step 6: Install Python Dependencies
```bash
# Make sure you're in backend folder with venv activated
pip install -r requirements.txt

# Wait for all packages to install
# Should see "Successfully installed X packages"
```

#### Step 7: Start Flask Backend
```bash
# Run the Flask application
python app.py

# You should see:
# * Running on http://localhost:5000
# * WARNING: Development server running in production mode
```

**Keep this terminal window open** - Flask must keep running

**If Flask won't start:**
- Check if port 5000 is available
- Verify MQTT broker is running
- See Troubleshooting section

---

### PHASE 4: Setup Frontend (5 minutes)

The frontend is the user dashboard where you control devices and simulate attacks.

#### Step 8: Open New Terminal Window
Don't close the Flask terminal. Open a **new terminal window** and navigate:
```bash
cd "c:\Users\vnada\OneDrive\Documents\Cyber_Project\Simulation-Based-Attack-Defense-Training-for-Critical-Infrastructure-Security-\Sample\frontend"
```

#### Step 9: Install Node Packages
```bash
# Install all React dependencies
npm install

# This may take 2-3 minutes
# Should complete without errors
```

#### Step 10: Start React Application
```bash
# Start the development server
npm start

# Your browser should automatically open to http://localhost:3000
# If not, open it manually
```

**Keep this terminal window open too** - React development server must keep running

---

## ✅ VERIFYING YOUR SETUP

### Complete Checklist

Before proceeding, verify all services are running:

```bash
# Open a third terminal window and check:

# 1. Check MQTT Broker
docker ps | grep mosquitto
# Should show: smart_home_mqtt_broker running

# 2. Check Flask Backend
curl http://localhost:5000/health
# Should return: OK or status info

# 3. Check React Frontend
curl http://localhost:3000
# Should return HTML content

# 4. Check Ports
netstat -an | grep LISTEN
# Should show: 3000, 5000, 1883, 9001 all in LISTENING state
```

### Service Status Overview

| Service | Port | URL | Status |
|---------|------|-----|--------|
| React Frontend | 3000 | http://localhost:3000 | ✅ Should load immediately |
| Flask Backend | 5000 | http://localhost:5000 | ✅ Should return JSON |
| MQTT Broker | 1883 | (internal) | ✅ Should show in docker ps |
| MQTT WebSocket | 9001 | (internal) | ✅ Used by browser |

---

## 🚀 RUNNING THE PLATFORM

### Starting Everything (Fresh Run)

**Terminal 1 - Start MQTT Broker:**
```bash
cd Sample
docker-compose up -d
# Verify: docker ps
```

**Terminal 2 - Start Flask Backend:**
```bash
cd Sample/backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

**Terminal 3 - Start React Frontend:**
```bash
cd Sample/frontend
npm start
# Browser opens automatically to http://localhost:3000
```

### Stopping Everything

When done, stop services in reverse order:

```bash
# Terminal with React - Press Ctrl+C
# Terminal with Flask - Press Ctrl+C
# Terminal with Docker
docker-compose down
```

### Restarting Services

**Don't need to reinstall, just restart:**

```bash
# MQTT Broker
docker-compose restart

# Flask (if it crashed)
# cd backend && python app.py

# React (if it crashed)
# cd frontend && npm start
```

---

## 📱 USING THE PLATFORM

### First Login

1. **Open browser** to `http://localhost:3000`
2. **Login credentials:**
   - **Username:** user1
   - **Password:** demo
3. Click **Login**

### Dashboard Overview

Once logged in, you'll see the main dashboard with:

#### 🔵 System Status (Top Right)
- Connection status to MQTT
- Active devices count
- System uptime

#### 🟢 Active Devices Section
Shows real-time status of:
- **Light 1 & 2** - Current on/off state
- **Thermostat** - Current temperature
- **Smart Lock** - Locked/unlocked state

#### 🟠 Security Alerts
Recent suspicious activities detected by the system

#### 📖 Getting Started Guide
Quick reference for platform features

---

### Feature 1: Safe Device Control

**Location:** Dashboard → Device Controls tab

#### Controlling Lights
1. Click **Light 1** or **Light 2** panel
2. Toggle the **On/Off** switch
3. Watch state change in real-time
4. Event is logged to database

#### Controlling Thermostat
1. Click **Thermostat** panel
2. Drag temperature slider or enter value
3. Set target temperature (60-80°F)
4. Command sent and logged

#### Controlling Smart Lock
1. Click **Smart Lock** panel
2. Click **Lock** or **Unlock** button
3. See state change immediately
4. Action logged with timestamp

**Important:** All these actions are:
- ✅ Authorized (logged-in user)
- ✅ Validated (proper format)
- ✅ Logged (recorded in database)

---

### Feature 2: Simulating Attacks

**Location:** Dashboard → Perform Attack tab

This section lets you execute **educational cyberattacks** to understand vulnerabilities.

#### Attack Types Available

**1. Unauthorized Device Control**
```
What it does:
• Bypasses backend authorization
• Sends command directly to MQTT
• System should detect as attack

How to use:
1. Click "Execute Unauthorized Control"
2. Select target device
3. Action sent via unauthorized path
4. Check Defense tab for alert
```

**2. Authentication Bypass**
```
What it does:
• Attempts to bypass session checks
• Tests input validation
• Should be blocked or flagged

How to use:
1. Click "Test Auth Bypass"
2. Observe response
3. Check logs for security event
```

**3. Denial of Service (DoS)**
```
What it does:
• Sends rapid-fire commands
• Tests rate limiting
• System should throttle or block

How to use:
1. Click "Send Rapid Commands"
2. System floods with requests
3. Observe detection
4. Check DoS counter in Defense tab
```

**4. Malformed Messages**
```
What it does:
• Sends invalid JSON/payload
• Tests error handling
• Should be rejected gracefully

How to use:
1. Click "Send Malformed Message"
2. System attempts to process invalid data
3. Should be rejected
4. Error logged
```

**After Each Attack:**
- Check **Defense tab** for security alert
- Verify **timestamp** and **attack type**
- Review **system response** logged

---

### Feature 3: Monitoring & Defense

**Location:** Dashboard → Defense & Logs tab

#### Security Summary (Top)
- **Total Attacks Detected:** Count of all suspicious activities
- **Total Events:** All logged activities
- **System Status:** Overall security health

#### Critical Alerts (Middle)
High-priority security warnings with:
- 🚨 Alert type
- ⏰ Timestamp
- 📝 Description
- 🎯 Affected device (if applicable)

#### Event Logs (Bottom - Filterable)

All activities logged with:
- **Timestamp** - When it occurred
- **Type** - What kind of event:
  - 🚨 **ATTACK** - Suspicious/unauthorized activity
  - 🛡️ **DEFENSE** - System response/alert
  - 🔌 **DEVICE_UPDATE** - Normal device commands
  - 🔐 **AUTH** - Login/session events
- **Device** - Which device affected
- **Message** - Detailed description
- **Severity** - Low/Medium/High

#### Using Filters
```
Filter by:
• Type: Show only ATTACK, DEFENSE, etc.
• Device: Show only specific device events
• Date Range: Show events from specific timeframe
• Keyword: Search in message text

Example:
Type: ATTACK + Device: light1 = See all attacks on light1
```

#### Exporting Logs
```bash
# Logs can be downloaded for analysis
• Click "Export Logs" button
• Saves as CSV for external analysis
• Useful for reporting and documentation
```

---

### Feature 4: User Permissions

**Test with Different Users:**

#### User 1 (Full Access)
- **Username:** user1
- **Password:** demo
- **Permissions:** All devices (light1, light2, thermostat, lock)
- **Can:** Control everything, execute all attacks

#### User 2 (Limited Access)
- **Username:** user2
- **Password:** demo
- **Permissions:** Only light1
- **Can:** Only control light1, attack attempts on other devices will be blocked

**To Test:**
1. Login as user1, control all devices ✅
2. Logout (click profile → Logout)
3. Login as user2
4. Try to control thermostat → **Access Denied** ✅
5. Try to control light1 → **Success** ✅

---

## 🔒 ADVANCED FEATURES

### Understanding Attack Detection

The backend automatically detects attacks by monitoring for:

#### 1. Special Flags in Messages
```json
// Detected as attack:
{"action": "on", "attack": true}
{"action": "on", "bypass_auth": true}
{"action": "on", "rapid_fire": true}
```

#### 2. Malformed/Invalid Messages
```json
// Invalid JSON - detected
{invalid json content}

// Missing required fields - detected
{"action": "on"}  // Missing device info
```

#### 3. Unauthorized Users
```
• User not logged in
• User accessing device they don't own
• Session token invalid/expired
```

#### 4. Rate Limit Violations
```
• More than X commands per minute
• Rapid repetition of same command
• Burst of commands from same user
```

### Database Structure

Logs stored in SQLite (`smart_home_logs.db`):

```
LOGS Table:
• timestamp - When it occurred
• type - Event type (ATTACK, DEFENSE, etc.)
• device - Target device
• user - Acting user
• message - Detailed description
• severity - Alert level
• metadata - Additional JSON data
```

### API Endpoints Reference

**For developers/advanced users:**

```bash
# Login
POST /api/login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "demo"}'

# Get session info
GET /api/session
curl http://localhost:5000/api/session

# List all devices
GET /api/devices
curl http://localhost:5000/api/devices

# Control a device
POST /api/control-device
curl -X POST http://localhost:5000/api/control-device \
  -H "Content-Type: application/json" \
  -d '{"device": "light1", "action": "on"}'

# Get logs with filters
GET /api/logs?limit=50&type=ATTACK&device=light1
curl "http://localhost:5000/api/logs?limit=50"

# Clear all logs
POST /api/logs/clear
curl -X POST http://localhost:5000/api/logs/clear

# Logout
POST /api/logout
curl -X POST http://localhost:5000/api/logout
```

---

## 🆘 TROUBLESHOOTING

### Issue 1: MQTT Broker Won't Start

**Symptoms:**
- `docker ps` doesn't show mosquitto
- Error about port 1883 already in use

**Solutions:**
```bash
# Option 1: Check if something else uses the port
netstat -an | grep 1883

# Option 2: Kill existing process (Windows)
netstat -ano | findstr :1883
taskkill /PID <PID> /F

# Option 3: Restart Docker
docker-compose down
docker-compose up -d

# Option 4: Use different port in docker-compose.yml
# Change "1883:1883" to "1884:1883"
```

### Issue 2: Flask Backend Won't Connect to MQTT

**Symptoms:**
- Backend starts but says "No connection to MQTT"
- Logs show "Connection refused"

**Solutions:**
```bash
# Check MQTT_BROKER setting in app.py:
# For local development: MQTT_BROKER = 'localhost'
# For Docker: MQTT_BROKER = 'mosquitto'

# Verify broker is running
docker ps | grep mosquitto

# Check broker logs
docker-compose logs mosquitto

# Restart backend after verifying broker
python app.py
```

### Issue 3: Frontend Can't Connect to Backend

**Symptoms:**
- React loads but shows "Backend unavailable"
- Console shows connection errors

**Solutions:**
```bash
# Check Flask is running
curl http://localhost:5000/health

# Check proxy in frontend package.json
# Should have: "proxy": "http://localhost:5000"

# Restart frontend
npm start

# Clear browser cache: Ctrl+Shift+Delete
```

### Issue 4: Port Already in Use

**Symptoms:**
- "Port 3000 already in use" or similar
- Can't start frontend/backend

**Solutions:**
```bash
# Find process using port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Find process using port (macOS/Linux)
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm start  # React
# For Flask, change port in app.py
```

### Issue 5: "Database Locked" Error

**Symptoms:**
- Backend crashes with database error
- Multiple instances trying to access database

**Solutions:**
```bash
# Delete corrupted database
cd backend
rm smart_home_logs.db

# Backend will create new database on restart
python app.py
```

### Issue 6: Login Page Shows But Can't Login

**Symptoms:**
- Login page loads
- "Invalid credentials" error even with correct password

**Solutions:**
```bash
# Verify backend is running and API is accessible
curl http://localhost:5000/api/login

# Check browser console for error messages (F12)

# Restart Flask backend
# Ctrl+C in Flask terminal
python app.py
```

---

## 📚 NEXT STEPS & LEARNING

### What to Try First

1. **Basic Operations**
   - Login and explore dashboard
   - Control each device type
   - Observe real-time updates

2. **Attack Simulation**
   - Execute each attack type
   - Watch Defense tab for alerts
   - Understand detection logic

3. **Permission Testing**
   - Login as different users
   - Try accessing restricted devices
   - Understand authorization

4. **Log Analysis**
   - Filter logs by type
   - Identify attack patterns
   - Export logs for study

### Advanced Exploration

1. **Code Review**
   - Study app.py for attack detection logic
   - Review React components for real-time updates
   - Understand MQTT message format

2. **Modify & Extend**
   - Add new attack types
   - Implement rate limiting
   - Create new device types

3. **Performance Testing**
   - Send large numbers of commands
   - Monitor resource usage
   - Test DoS detection

### Security Concepts Learned

✅ **IoT/MQTT Fundamentals**
- Message-oriented communication
- Publish-subscribe architecture
- Topic-based routing

✅ **Authentication & Authorization**
- Session management
- Permission-based access control
- User validation

✅ **Attack Detection**
- Pattern recognition
- Anomaly detection
- Rate limiting

✅ **Secure Logging**
- Audit trails
- Security event tracking
- Real-time alerting

✅ **IoT Security Challenges**
- Device resource constraints
- Network vulnerability
- Scalability issues

### Real-World Applications

This training platform teaches concepts used in:
- Smart home systems (Amazon Alexa, Google Home)
- Industrial IoT networks
- Building automation systems
- Healthcare IoT devices
- Connected vehicle systems

---

## 📞 QUICK REFERENCE

### Essential Commands

```bash
# Start MQTT
docker-compose up -d

# Start Backend
cd backend && python app.py

# Start Frontend
cd frontend && npm start

# Stop Everything
docker-compose down
# + Ctrl+C in other terminals

# Check Status
docker ps
curl http://localhost:5000/health
curl http://localhost:3000

# View Logs
docker-compose logs mosquitto
# Backend logs in terminal window
```

### Emergency Troubleshooting

```bash
# Reset everything
docker-compose down
rm backend/smart_home_logs.db
rm -rf frontend/node_modules

# Fresh start
docker-compose up -d
cd backend && pip install -r requirements.txt && python app.py
cd frontend && npm install && npm start
```

### Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:3000 | Main application |
| API | http://localhost:5000 | Backend API |
| Health | http://localhost:5000/health | Status check |
| MQTT | localhost:1883 | Message broker |

---

## ✨ FINAL NOTES

### Success Indicators

You're set up correctly when you see:
- ✅ Browser shows login page at localhost:3000
- ✅ Can login with user1/demo
- ✅ Dashboard shows active devices
- ✅ Device controls respond instantly
- ✅ Attacks generate alerts in Defense tab
- ✅ Logs record all activities

### Remember

- **This is educational** - use knowledge responsibly
- **Never attack systems you don't own**
- **Always seek permission** before testing security
- **Document everything** you learn
- **Practice safely** in this controlled environment

---

## 🎓 Congratulations!

You've successfully deployed a complete cybersecurity training platform. You can now:
- 🎯 Understand IoT architecture
- 🛡️ Learn attack detection
- 🔐 Practice secure coding
- 📊 Analyze security logs
- 🚀 Build secure systems

**Happy Learning! Stay Curious! Code Safely! 🔒**

---

**For detailed information on specific topics, refer to README.md**
