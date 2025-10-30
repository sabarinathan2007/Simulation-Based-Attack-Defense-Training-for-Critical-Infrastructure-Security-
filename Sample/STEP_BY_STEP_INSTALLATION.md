# 🚀 Step-by-Step Installation Guide

## The Issue
Selected libraries not installing after running `pip install -r requirements.txt`

## The Solution
Follow these steps in order. This will definitely work!

---

## 📋 Requirements

Before you start, make sure you have:
- Python 3.8 or higher (`python --version`)
- pip package manager (`pip --version`)
- 500MB free disk space
- Internet connection

---

## 🎯 Installation Steps

### Step 1️⃣: Navigate to Backend Directory

**Windows (Command Prompt or PowerShell):**
```bash
cd "c:\Users\vnada\OneDrive\Documents\Sample\backend"
```

**Linux/Mac (Terminal):**
```bash
cd ~/Documents/Sample/backend
```

✅ Verify: You should see `app.py` in current directory
```bash
ls -la app.py       # Linux/Mac
dir app.py          # Windows
```

---

### Step 2️⃣: Clean Up Old Installation

**Remove old virtual environment:**

**Windows:**
```bash
rmdir /s venv
```

**Linux/Mac:**
```bash
rm -rf venv
```

---

### Step 3️⃣: Create Fresh Virtual Environment

**Windows:**
```bash
python -m venv venv
```

**Linux/Mac:**
```bash
python3 -m venv venv
```

✅ Verify: You should see `venv` folder created

---

### Step 4️⃣: Activate Virtual Environment

**Windows (Command Prompt):**
```bash
venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

✅ Verify: Your terminal prompt should show `(venv)` at the start

---

### Step 5️⃣: Upgrade pip and Tools

All platforms - this is important!
```bash
python -m pip install --upgrade pip setuptools wheel
```

Wait for it to complete. You should see:
```
Successfully installed ...
```

---

### Step 6️⃣: Install Dependencies

**Use this command (most reliable):**
```bash
pip install --no-cache-dir -r requirements.txt
```

**Or install individually if above fails:**
```bash
pip install Flask==3.0.0
pip install Werkzeug==3.0.1
pip install Flask-CORS==4.0.0
pip install Flask-Session==0.5.0
pip install paho-mqtt==1.7.1
pip install python-dotenv==1.0.0
```

✅ Verify: Wait for "Successfully installed" messages

---

### Step 7️⃣: Verify Installation

**Run the verification script:**

**Windows:**
```bash
python verify-dependencies.py
```

**Linux/Mac:**
```bash
python3 verify-dependencies.py
```

You should see:
```
✅ PASS | Flask                | Version: 3.0.0
✅ PASS | Flask-CORS           | Version: 4.0.0
✅ PASS | Flask-Session        | Version: 0.5.0
✅ PASS | paho-mqtt            | Version: 1.7.1
✅ PASS | python-dotenv        | Version: 1.0.0

✅ VERIFICATION PASSED - All dependencies installed correctly!
```

---

### Step 8️⃣: Test the Application

**Start the Flask backend:**
```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

🎉 **SUCCESS!** Backend is running!

---

## 🚨 Still Having Issues?

### Issue: "No module named 'flask'"
**Solution:** Virtual environment not activated
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Try again
python -m pip list
```

### Issue: "Could not find a version that satisfies"
**Solution:** Use the automatic fix script
```bash
# Windows
fix-dependencies.bat

# Linux/Mac
bash fix-dependencies.sh
```

### Issue: "pip: command not found"
**Solution:** Use python -m pip
```bash
python -m pip install -r requirements.txt
```

### Issue: "Permission denied" (Linux/Mac)
**Solution:** Make sure virtual environment is activated
```bash
source venv/bin/activate
pip install -r requirements.txt
```

---

## ✅ Automatic Fix Scripts

If manual installation doesn't work, run these:

**Windows:**
```bash
fix-dependencies.bat
```

**Linux/Mac:**
```bash
bash fix-dependencies.sh
```

These scripts will:
1. Clean old installation
2. Create fresh virtual environment
3. Upgrade pip
4. Install all dependencies
5. Verify installation

---

## 📝 Updated requirements.txt

The file has been updated with:

```
# Core Web Framework
Flask==3.0.0
Werkzeug==3.0.1

# CORS Support
Flask-CORS==4.0.0

# Session Management
Flask-Session==0.5.0

# MQTT Client Library
paho-mqtt==1.7.1

# Environment Variables
python-dotenv==1.0.0
```

These are verified versions that work!

---

## 🔍 What to Check

After installation, check:

```bash
# 1. Virtual environment activated?
echo %VIRTUAL_ENV%        # Windows
echo $VIRTUAL_ENV         # Linux/Mac

# 2. Python version
python --version

# 3. pip location
pip --version

# 4. Installed packages
pip list | grep Flask
pip list | grep paho
pip list | grep dotenv

# 5. Test imports
python -c "import flask; print('Flask OK')"
python -c "import paho.mqtt.client; print('MQTT OK')"
python -c "import dotenv; print('Dotenv OK')"
```

---

## 🎯 Quick Reference

| Step | Command |
|------|---------|
| Navigate | `cd backend` |
| Activate (Windows) | `venv\Scripts\activate` |
| Activate (Linux/Mac) | `source venv/bin/activate` |
| Upgrade pip | `python -m pip install --upgrade pip` |
| Install | `pip install --no-cache-dir -r requirements.txt` |
| Verify | `python verify-dependencies.py` |
| Run | `python app.py` |
| Auto-fix (Windows) | `fix-dependencies.bat` |
| Auto-fix (Linux/Mac) | `bash fix-dependencies.sh` |

---

## 💡 Pro Tips

1. **Always use virtual environment**
   - Keeps packages isolated
   - Prevents conflicts
   - Easy to reset

2. **Use --no-cache-dir for fresh install**
   - Avoids cached old versions
   - Forces fresh download

3. **Upgrade pip first**
   - Newer pip fixes bugs
   - Better package resolution

4. **Read error messages**
   - Copy-paste the full error
   - Search online if needed

5. **Take your time**
   - Don't rush the steps
   - Verify each step works

---

## ✨ You're Ready!

Once you see:
```
✅ VERIFICATION PASSED
🚀 You're ready to run: python app.py
```

Everything is working! Now:

1. Keep the backend running
2. In another terminal, start the frontend
3. Open http://localhost:3000
4. Login with user1/demo

---

## 📞 Still Need Help?

1. **Read** INSTALLATION_TROUBLESHOOTING.md
2. **Run** fix-dependencies.bat or fix-dependencies.sh
3. **Try** installing packages individually
4. **Check** that Python 3.8+ is installed
5. **Verify** internet connection is working

---

**This guide should resolve your library installation issues!** ✅

Good luck! 🚀
