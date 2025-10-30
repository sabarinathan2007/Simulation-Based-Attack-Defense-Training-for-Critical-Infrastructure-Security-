# 🚀 RUN THE BACKEND - Complete Guide

## ✅ You Have Everything You Need

Your backend is fully configured and ready to run!

---

## 🎯 Quick Start (3 Steps)

### Step 1: Ensure Dependencies Are Installed

**Windows:**
```bash
cd backend
fix-all.bat
```

**Linux/Mac:**
```bash
cd backend
bash fix-all.sh
```

This will:
- Clean old installation
- Create fresh virtual environment
- Install all dependencies including paho-mqtt==2.1.0
- Verify everything works

### Step 2: Start MQTT Broker (New Terminal)

```bash
# From project root directory
docker-compose up -d mosquitto
```

Or if Docker not running:
```bash
# Windows
"C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Then wait for Docker to start, then run docker-compose command
```

### Step 3: Start Backend (New Terminal)

**Windows:**
```bash
cd backend
startup.bat
```

**Linux/Mac:**
```bash
cd backend
bash startup.sh
```

---

## 🔍 What These Scripts Do

### `test-system.py` (Automatic Testing)
Runs before starting and checks:
- ✅ Python version (3.8+)
- ✅ All packages installed
- ✅ Flask working
- ✅ MQTT client working
- ✅ Database working
- ✅ File structure complete
- ✅ Configuration valid
- ✅ Ports available

### `startup.bat` / `startup.sh` (Automated Startup)
1. Checks Python installation
2. Creates virtual environment (if needed)
3. Activates virtual environment
4. Runs system tests
5. Starts Flask backend

---

## 📊 Expected Output

When you run the startup script:

```
============================================================
🚀 Smart Home Backend - Automated Startup
============================================================

[STEP 1/5] Checking Python installation...
✅ Python is installed
Python 3.11.4

[STEP 2/5] Checking virtual environment...
✅ Virtual environment ready

[STEP 3/5] Activating virtual environment...
✅ Virtual environment activated

[STEP 4/5] Running system tests...

✅ ALL TESTS PASSED!

[STEP 5/5] Starting Flask backend...

============================================================
✅ Backend is starting...
============================================================

📡 Backend URL: http://127.0.0.1:5000
🔗 Health Check: http://127.0.0.1:5000/health

💡 IMPORTANT:
   1. Make sure MQTT broker is running...
   2. Keep this terminal running
   3. Open new terminal for frontend
   4. Access web interface at http://localhost:3000

 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

---

## 🎮 Next: Start Frontend

In a **NEW terminal**:

```bash
cd frontend
npm install  # First time only
npm start
```

You should see:
```
Compiled successfully!
You can now view your app in the browser at:
  http://localhost:3000
```

---

## 🌐 Access the Platform

Open your browser:
```
http://localhost:3000
```

Login with:
- **Username:** user1
- **Password:** demo

---

## 📋 Complete Startup Sequence

### Terminal 1: MQTT Broker
```bash
# From project root
docker-compose up -d mosquitto

# Or for full logs:
docker-compose up mosquitto
```

### Terminal 2: Backend
```bash
cd backend
startup.bat          # Windows
bash startup.sh      # Linux/Mac
```

Should show:
```
 * Running on http://127.0.0.1:5000
```

### Terminal 3: Frontend
```bash
cd frontend
npm start
```

Should show:
```
Compiled successfully!
You can now view your app in the browser at:
  http://localhost:3000
```

### Terminal 4: Browser
```
http://localhost:3000
Login: user1 / demo
```

---

## ✅ Verification

### Check Backend Health
```bash
# In any terminal:
curl http://127.0.0.1:5000/health
```

Should return:
```json
{
  "status": "healthy",
  "mqtt_connected": true,
  "database": "ok"
}
```

### Check MQTT Connection
```bash
# Terminal where backend is running
# You should see in logs:
# Connected to MQTT broker
```

### Check Frontend Connection
```
# Browser console (F12)
# Should show MQTT connection established
```

---

## 🔧 Troubleshooting

### Backend won't start: "ModuleNotFoundError"
```bash
cd backend
fix-all.bat          # Windows
bash fix-all.sh      # Linux/Mac
```

### Backend starts but MQTT connection fails
```bash
# Make sure MQTT broker is running:
docker ps | grep mosquitto

# If not running, start it:
docker-compose up -d mosquitto
```

### Port 5000 already in use
```bash
# Windows - Find and kill process on port 5000:
netstat -ano | findstr :5000

# Linux/Mac:
lsof -i :5000
kill -9 <PID>
```

### Frontend won't connect
```bash
# Make sure backend is running
# Make sure MQTT broker is running
# Check browser console for errors (F12)
```

---

## 📁 File Organization

```
backend/
├── app.py                    ← Main Flask app
├── requirements.txt          ← Dependencies (UPDATED)
├── verify-dependencies.py    ← Test script
├── test-system.py           ← Complete system tests
├── startup.bat              ← Windows startup
├── startup.sh               ← Linux/Mac startup
├── fix-all.bat              ← Windows dependency fix
├── fix-all.sh               ← Linux/Mac dependency fix
└── smart_home_logs.db       ← Database (auto-created)
```

---

## 🎯 What's Happening When Backend Runs

1. **Database Initialization**
   - Creates/checks smart_home_logs.db
   - Sets up logs table

2. **MQTT Connection**
   - Connects to localhost:1883 (Mosquitto broker)
   - Subscribes to /devices/# topics
   - Starts background thread

3. **API Server Starts**
   - Flask runs on http://127.0.0.1:5000
   - CORS enabled for frontend
   - Session management enabled

4. **Ready for Frontend**
   - Backend listens for REST API calls
   - MQTT broker ready for messages
   - Database ready for logging

---

## 🚀 Running Without Startup Script

If you prefer manual steps:

```bash
# 1. Navigate to backend
cd backend

# 2. Activate venv (Windows)
venv\Scripts\activate

# 2. Activate venv (Linux/Mac)
source venv/bin/activate

# 3. Run tests
python test-system.py

# 4. Start backend
python app.py
```

---

## 📊 System Requirements

- ✅ Python 3.8+
- ✅ Docker (for MQTT broker)
- ✅ 500MB disk space
- ✅ Ports: 5000 (backend), 1883 (MQTT), 9001 (WebSocket), 3000 (frontend)

---

## 💡 Pro Tips

1. **Keep terminals open**
   - Terminal 1: MQTT broker (don't close)
   - Terminal 2: Backend (don't close)
   - Terminal 3: Frontend (don't close)

2. **Monitor logs**
   - Watch Terminal 1 for MQTT events
   - Watch Terminal 2 for API calls
   - Check browser console (F12) for frontend

3. **Test quickly**
   - Use http://127.0.0.1:5000/health to test backend
   - Frontend automatically connects on load

4. **Database**
   - Auto-created on first run
   - Can view with: `sqlite3 smart_home_logs.db`
   - Clear logs in UI (Defense tab)

---

## ✨ Everything is Automated!

The scripts handle:
- ✅ Checking dependencies
- ✅ Creating virtual environment
- ✅ Testing all systems
- ✅ Starting services
- ✅ Showing status and next steps

**Just run `startup.bat` or `startup.sh` and everything works!**

---

## 🎉 You're All Set!

Your backend is ready to run. Choose your method:

### Option 1: One-Click Start (Easiest)
```bash
cd backend
startup.bat          # Windows
bash startup.sh      # Linux/Mac
```

### Option 2: Manual Start
```bash
cd backend
source venv/bin/activate  # Or: venv\Scripts\activate (Windows)
python app.py
```

### Option 3: With Full Testing
```bash
cd backend
python test-system.py    # Run tests first
python app.py            # Then start
```

---

## 📞 Need Help?

- **Tests failing?** Run `fix-all.bat` or `fix-all.sh`
- **MQTT not working?** Make sure docker-compose up -d mosquitto runs
- **Port in use?** Kill process using that port
- **Imports failing?** Check requirements installed: `pip list`

---

**Ready to go! Start with `startup.bat` or `startup.sh`!** 🚀

