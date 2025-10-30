# Quick Reference Guide

## 🚀 Super Quick Start (5 Minutes)

### 1. Prerequisites
```bash
docker -v           # Docker should be installed
python3 --version   # Python 3.8+
node --version      # Node.js 14+
```

### 2. Start MQTT Broker
```bash
cd project/root
docker-compose up -d mosquitto
# Wait 2-3 seconds for startup
```

### 3. Start Backend (Terminal 1)
```bash
cd backend
python -m venv venv
source venv/bin/activate    # Mac/Linux
# OR venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
# Should print: "Running on http://127.0.0.1:5000"
```

### 4. Start Frontend (Terminal 2)
```bash
cd frontend
npm install  # First time only
npm start
# Should open http://localhost:3000 automatically
```

### 5. Login & Explore
- **URL**: http://localhost:3000
- **Username**: user1
- **Password**: demo

---

## 📱 What Each Page Does

| Page | Purpose | Try This |
|------|---------|----------|
| **Dashboard** | See live status & recent attacks | Refresh and watch real-time updates |
| **Device Controls** | Safely control smart devices | Toggle a light and see state change |
| **Perform Attack** | Execute attacks for learning | Click "Execute Unauthorized Control" |
| **Defense & Logs** | View all security events | Look for attack in the logs table |

---

## 🎯 Example Attack Flow

1. Go to **Perform Attack** tab
2. Select target device (e.g., "Light 1")
3. Click **"Execute Unauthorized Control"**
4. See alert: "Attack sent!"
5. Go to **Defense & Logs** tab
6. See the attack logged with timestamp
7. Notice the severity level and device targeted

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" on port 3000 | Frontend not running - run `npm start` in frontend folder |
| "Connection refused" on port 5000 | Backend not running - run `python app.py` in backend folder |
| "Cannot connect to MQTT" | Docker not running - run `docker-compose up -d mosquitto` |
| Login not working | Use password "demo" (case sensitive) |
| No devices showing | Devices appear after first control command |

---

## 💻 Useful Commands

```bash
# View Docker status
docker-compose ps

# View MQTT logs
docker-compose logs mosquitto

# Stop everything
docker-compose down

# Restart backend
# (Ctrl+C in terminal, then python app.py)

# Clear database
rm backend/smart_home_logs.db

# View backend logs
tail -f backend/app.log  # Linux/Mac
```

---

## 🔗 Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Backend Health | http://localhost:5000/health |
| MQTT Broker | localhost:1883 |
| MQTT WebSocket | ws://localhost:9001 |

---

## 📊 Default Demo Accounts

```
user1 / demo  → Full access to all devices
user2 / demo  → Limited access (light1 only)
anyuser / demo → Any username, password must be "demo"
```

---

## 🎓 Learning Path

1. **Start**: Login and explore Dashboard
2. **Understand**: Use Device Controls to see how devices work
3. **Attack**: Go to Perform Attack and try one attack
4. **Observe**: Check Defense tab to see attack logged
5. **Analyze**: Read the log details and learn what was detected
6. **Repeat**: Try different attack types
7. **Defend**: Research how defenses work

---

## ⚙️ Key Configuration Files

| File | Purpose | Edit When... |
|------|---------|--------------|
| `app.py` | Backend logic | Changing MQTT broker or auth rules |
| `mosquitto.conf` | MQTT settings | Enabling authentication or encryption |
| `docker-compose.yml` | Container setup | Changing ports or adding services |
| `App.js` | Frontend routing | Changing page navigation |

---

## 🐛 Common Issues & Fixes

### "Port already in use"
```bash
# Find what's using the port (Linux/Mac)
lsof -i :3000    # Frontend port
lsof -i :5000    # Backend port
lsof -i :9001    # MQTT WebSocket port

# Kill the process
kill -9 <PID>
```

### "npm ERR! 404"
```bash
# Clear npm cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### "Python: command not found"
```bash
# Try python3 instead
python3 -m venv venv
python3 app.py
```

### Database locked
```bash
# Delete and recreate
rm backend/smart_home_logs.db
# Restart backend - new DB will be created automatically
```

---

## 📝 Notes

- **Demo Only**: This is educational software. Defenses are simplified for learning.
- **No Persistence**: When you restart, logs are cleared (database is recreated).
- **Anonymous MQTT**: For demo. Production needs proper authentication.
- **Single User**: Platform doesn't fully separate users - for demo purposes.

---

## 🔒 Security Reminders

- ✅ This platform teaches security concepts
- ❌ Don't use these attack techniques on real systems
- ⚠️ Never expose this to the internet without proper security
- 🔐 In production, use proper authentication, encryption, and monitoring

---

## 📚 Learn More

- MQTT: https://mqtt.org/
- IoT Security: https://www.iot-home.org/
- Flask: https://flask.palletsprojects.com/
- React: https://react.dev/

---

**Built for Learning. Use Responsibly. Stay Secure! 🔒**
