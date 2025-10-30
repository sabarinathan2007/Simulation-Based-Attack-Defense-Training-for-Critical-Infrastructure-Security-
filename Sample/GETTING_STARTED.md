# Getting Started Guide

## 🎯 Your First 15 Minutes

Welcome! This guide will get you up and running in just 15 minutes.

---

## Step 1: Verify Prerequisites (2 minutes)

Check that you have everything installed:

```bash
# Check Docker
docker --version
# Should output: Docker version 20.x.x or higher

# Check Python
python3 --version
# Should output: Python 3.8 or higher

# Check Node.js
node --version
# Should output: v14.x.x or higher
```

**Don't have one?**
- Docker: https://www.docker.com/products/docker-desktop
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/

---

## Step 2: Run the Setup Script (5 minutes)

Choose based on your operating system:

### Linux / macOS
```bash
cd /path/to/project
bash setup.sh
```

### Windows (Command Prompt or PowerShell)
```bash
cd \path\to\project
setup.bat
```

**What the script does:**
1. ✓ Checks prerequisites
2. ✓ Starts MQTT broker in Docker
3. ✓ Creates Python virtual environment
4. ✓ Installs Python dependencies
5. ✓ Installs Node.js dependencies

---

## Step 3: Start the Services (5 minutes)

Open **3 separate terminals/command prompts** and run:

### Terminal 1: Start MQTT Broker
```bash
docker-compose up -d mosquitto
# Output: smart_home_mqtt_broker ... done

# Verify it's running
docker ps | grep mosquitto
```

### Terminal 2: Start Backend
```bash
cd backend

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Run Flask backend
python app.py
```

**Expected output:**
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Terminal 3: Start Frontend
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start React development server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view your app in the browser at:
  http://localhost:3000
```

---

## Step 4: Login & Explore (3 minutes)

1. **Open Browser**
   - Navigate to: http://localhost:3000

2. **You should see the login page**
   - "🏠 Smart Home Security"
   - Login form with username/password

3. **Login with Demo Credentials**
   - Username: `user1`
   - Password: `demo`
   - Click "Login"

4. **You're In!**
   - You should see the Dashboard
   - Navigation menu at top

---

## Step 5: Navigate the Platform

### 📊 Dashboard (Current Page)
What you see:
- System Status (🟢 Connected)
- Active Devices list
- Recent Security Alerts
- Getting Started guide

**Try:** Refresh the page - the dashboard updates in real-time

### 🔌 Device Controls
Click "Device Controls" in the menu

What you can do:
- **Lights**: Toggle on/off
- **Thermostat**: Adjust temperature with slider
- **Smart Lock**: Lock/unlock

**Try:** 
1. Click "Turn On" for Light 1
2. See it turn on and status updates
3. Check Dashboard - device appears in "Active Devices"

### ⚔️ Perform Attack
Click "Perform Attack" in the menu

What you can do:
- Execute 4 different attack types
- Simulate cybersecurity threats
- See real-time detection

**Try:**
1. Select target: "Light 1"
2. Click "Execute Unauthorized Control"
3. See message: "⚔️ Attack sent!"
4. Go to "Defense & Logs" tab

### 🛡️ Defense & Logs
Click "Defense & Logs" in the menu

What you see:
- Security Summary (attack count, total events)
- Critical Alerts section
- Event Logs table (all events)
- Filter buttons (All Events, Attacks, Device Updates, Auth Events)

**Try:**
1. Look for your attack in the logs
2. Check the timestamp
3. See the severity level
4. Read the message
5. Filter by "Attacks" - only shows attacks

---

## 🎓 Learning Path

### Path 1: Understand Safe Operations (5 minutes)
1. Go to Dashboard - understand system
2. Go to Device Controls - safely control a device
3. Go to Dashboard - see the event logged
4. Go to Defense & Logs - see DEVICE_UPDATE event

### Path 2: Learn Attack Detection (10 minutes)
1. Read the "Perform Attack" tab education section
2. Try one attack (e.g., Unauthorized Control)
3. Check Defense tab for attack log
4. Read the attack details
5. Try different attack types
6. Compare in logs

### Path 3: Study Security Events (5 minutes)
1. Perform some safe device controls
2. Perform some attacks
3. Go to Defense & Logs
4. Filter different log types
5. Study the events and timestamps
6. Understand what was detected

---

## 🔍 What to Try Next

### 1. Test Multiple Attacks
```
Try Each Attack Type:
□ Unauthorized Device Control
□ Authentication Bypass
□ Denial of Service (DoS)
□ Malformed Messages

Result: Each appears in Defense logs with different details
```

### 2. Test Authorization
```
Try This:
1. Logout (top right button)
2. Login with user2/demo
3. Go to Device Controls
4. Try to control Light 2 (should be denied!)
5. Go to Defense & Logs
6. See the authorization failure

Result: Limited users have fewer device access
```

### 3. Test Real-time Updates
```
Try This:
1. Open Dashboard in one tab
2. Go to Device Controls in another tab
3. Control a device
4. Go back to Dashboard - it updates automatically!

Result: Real-time MQTT synchronization works
```

### 4. Monitor Events
```
Try This:
1. Perform several actions (controls + attacks)
2. Go to Defense & Logs
3. Filter by different types
4. Watch timestamps
5. Clear logs and do it again

Result: Comprehensive audit trail
```

---

## 📱 Responsive Design

The platform works on:
- **Desktop** - Full interface
- **Tablet** - Adapted layout
- **Mobile** - Touch-friendly controls

Try resizing your browser window to see responsive design!

---

## 🆘 Something Not Working?

### "Frontend not loading (http://localhost:3000)"
```bash
# Check if npm start is running
# You should see "Compiled successfully!" message

# If not, try:
cd frontend
npm start

# If still not working:
rm -rf node_modules package-lock.json
npm install
npm start
```

### "Backend connection refused (5000)"
```bash
# Check if Flask is running
# You should see "Running on http://127.0.0.1:5000"

# If not, try:
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py

# If still not working:
pip install -r requirements.txt
python app.py
```

### "MQTT connection refused (1883/9001)"
```bash
# Check if MQTT is running
docker ps | grep mosquitto
# Should show smart_home_mqtt_broker

# If not running:
docker-compose up -d mosquitto

# If Docker not running:
# Start Docker Desktop app
```

### "Login fails"
- **Username**: Can be anything (e.g., user1, testuser, admin)
- **Password**: Must be exactly `demo` (case-sensitive!)
- Try: `user1` / `demo`

---

## 🎉 You Did It!

Congratulations! You've successfully:
- ✓ Set up the platform
- ✓ Started all services
- ✓ Logged in
- ✓ Explored all pages
- ✓ Controlled devices safely
- ✓ Performed attacks
- ✓ Observed defenses

---

## 🚀 Next Steps

### Option 1: Continue Learning
- Explore each attack type in detail
- Read the educational content on each page
- Try all device control options
- Understand the logs in Defense tab

### Option 2: Dive Into Code
- Open `backend/app.py` - see attack detection logic
- Open `frontend/src/components/` - see React implementation
- Read code comments - learn how it works
- See `ARCHITECTURE.md` for system design

### Option 3: Customize
- Read `CONFIGURATION.md` - see all settings
- Add new device types
- Create new attack patterns
- Modify detection rules

### Option 4: Deploy
- Read `README.md` - Deployment section
- Learn about production security
- Set up for your environment
- Share with team/students

---

## 📚 Documentation Quick Links

| When You Want | Go To |
|---------------|-------|
| Quick answers | [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md) |
| Full guide | [`README.md`](./README.md) |
| System architecture | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| All settings | [`CONFIGURATION.md`](./CONFIGURATION.md) |
| What's included | [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md) |
| Document index | [`INDEX.md`](./INDEX.md) |

---

## 💡 Pro Tips

1. **Watch the Logs in Real-time**
   - Open Defense & Logs in one tab
   - Perform actions in another tab
   - Logs update automatically (refresh every 3 seconds)

2. **Understand Attack Types**
   - Each attack type has different detection logic
   - Read the descriptions before trying
   - Study what makes each attack detectable

3. **Test Authorization**
   - Login with different users (user1 vs user2)
   - Notice different device access levels
   - Try unauthorized device access

4. **Read the Code**
   - Comments explain everything
   - Start with `backend/app.py` - main logic
   - Then explore components in `frontend/src/`

5. **Monitor System Status**
   - Dashboard shows MQTT connection status
   - Green = connected, Red = disconnected
   - If red, check MQTT broker (docker-compose logs mosquitto)

---

## 🔒 Important Reminders

- ✅ This is for **educational purposes**
- ✅ Everything is **logged and tracked**
- ✅ All actions are **reversible** (you can clear logs)
- ❌ Don't use these techniques on real systems
- ⚠️ This platform is intentionally **insecure for learning**
- 🔐 Production requires proper **security measures**

---

## 🎓 Educational Concepts You'll Learn

By using this platform, you'll understand:

1. **IoT Architecture**
   - Device simulation
   - Messaging protocols
   - Broker systems

2. **Cybersecurity Concepts**
   - Attack vectors
   - Detection mechanisms
   - Defense strategies

3. **Real-time Monitoring**
   - Event logging
   - Alert systems
   - Audit trails

4. **Authorization & Access Control**
   - User permissions
   - Device access rules
   - Session management

5. **Attack Patterns**
   - What makes an attack detectable
   - How anomalies are identified
   - Why certain defenses work

---

## ⏱️ Time Tracking

Your Progress:
- Prerequisites check: 2 minutes ✓
- Setup script: 5 minutes ✓
- Start services: 5 minutes ✓
- Login & explore: 3 minutes ✓
- **Total: ~15 minutes ✓**

You're now ready to:
- Explore all features
- Learn cybersecurity concepts
- Understand IoT security
- Experiment with attacks
- Study defenses

---

## 🎯 Success Criteria

You'll know everything is working when:

- ✓ MQTT broker container is running (`docker ps` shows it)
- ✓ Backend is running on port 5000 (http://localhost:5000/health → 200 OK)
- ✓ Frontend is running on port 3000 (page loads in browser)
- ✓ You can login with user1/demo
- ✓ Dashboard shows system status
- ✓ Device controls work (toggle a light)
- ✓ Attacks can be performed
- ✓ Attacks appear in logs

**All ✓ checked? You're ready to learn!**

---

## 🆘 Still Need Help?

1. **Check Troubleshooting** → `QUICK_REFERENCE.md`
2. **Read Full Guide** → `README.md`
3. **Review Architecture** → `ARCHITECTURE.md`
4. **Check Configuration** → `CONFIGURATION.md`
5. **View Logs** → `docker-compose logs` or check terminal outputs

---

## 🎉 Welcome Aboard!

You now have a complete, professional cybersecurity training platform running on your machine.

**You can:**
- Learn IoT security concepts
- Perform attack simulations
- Observe defense mechanisms
- Study real-time logs
- Understand authorization
- Experiment safely
- Share with others

**Enjoy your learning journey! 🚀**

---

**Next: Pick a documentation link above or start exploring the platform!**
