#!/bin/bash
# 🎉 QUICK START - Print this and follow!

cat << 'EOF'

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 SMART HOME BACKEND - QUICK START GUIDE 🚀           ║
║                                                            ║
║            Everything is ready! Just follow these steps:  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

SETUP (First Time Only)
═══════════════════════════════════════════════════════════

  cd backend
  
  Windows:        fix-all.bat
  Linux/Mac:      bash fix-all.sh
  
  Wait for: ✅ SUCCESS!

STARTUP (Every Time)
═══════════════════════════════════════════════════════════

  Terminal 1: MQTT Broker
  ─────────────────────────
  docker-compose up -d mosquitto
  (or: docker-compose up mosquitto)

  Terminal 2: Backend
  ─────────────────────────
  cd backend
  Windows:        startup.bat
  Linux/Mac:      bash startup.sh
  
  Wait for: * Running on http://127.0.0.1:5000

  Terminal 3: Frontend
  ─────────────────────────
  cd frontend
  npm start
  
  Wait for: Compiled successfully!

ACCESS
═══════════════════════════════════════════════════════════

  Open Browser:   http://localhost:3000
  Username:       user1
  Password:       demo
  
  Click "Login" →→→ Happy learning!

QUICK TESTS
═══════════════════════════════════════════════════════════

  Backend Health:
  curl http://127.0.0.1:5000/health
  
  Expected: {"status": "healthy", "mqtt_connected": true}

FILES YOU'LL USE
═══════════════════════════════════════════════════════════

  backend/startup.bat         (Windows start)
  backend/startup.sh          (Linux/Mac start)
  backend/fix-all.bat         (Windows fix)
  backend/fix-all.sh          (Linux/Mac fix)
  backend/test-system.py      (Test system)
  backend/HOW_TO_RUN.md       (Full guide)

KEEP RUNNING
═════════════════════════════════════════════════════════════

  DON'T CLOSE these terminals:
  • Terminal 1: MQTT (docker-compose)
  • Terminal 2: Backend (Flask)
  • Terminal 3: Frontend (React)

TROUBLESHOOTING
═════════════════════════════════════════════════════════════

  Can't run startup?
  → Run: python test-system.py (to see what's wrong)

  Missing dependencies?
  → Run: fix-all.bat or bash fix-all.sh

  MQTT not connecting?
  → Check: docker ps (see if mosquitto running)
  → Run: docker-compose up -d mosquitto

  Port in use?
  → Windows: netstat -ano | findstr :5000
  → Linux/Mac: lsof -i :5000 (then kill -9 <PID>)

DOCUMENTATION
═════════════════════════════════════════════════════════════

  Quick start:        backend/START_BACKEND.md
  Complete guide:     backend/HOW_TO_RUN.md
  Errors fixed:       PAHO_MQTT_ERROR_SOLVED.md
  Setup details:      BACKEND_READY_SUMMARY.md

═════════════════════════════════════════════════════════════

Ready? Start with:

    cd backend
    startup.bat         (Windows)
    bash startup.sh     (Linux/Mac)

Then open: http://localhost:3000

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              Let's go! 🚀🎉                                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

EOF
