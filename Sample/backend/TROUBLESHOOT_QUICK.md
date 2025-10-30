# ⚡ Quick Troubleshooting - Installation Errors

## 🎯 For Immediate Help - Choose Your Error

### ❌ "ModuleNotFoundError: No module named 'flask'"
**Quick Fix:**
```bash
# Make sure virtual environment is ACTIVATED
# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Then verify
pip list | grep Flask
```

---

### ❌ "ERROR: Could not find a version that satisfies the requirement"
**Quick Fix:**
```bash
# Use the updated requirements.txt
pip install --no-cache-dir -r requirements.txt

# Or update pip first
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

### ❌ "No matching distribution found for paho-mqtt==1.6.1"
**Quick Fix:**
```bash
# This version is old. Use:
pip install paho-mqtt>=1.7.1

# Or let pip choose:
pip install paho-mqtt
```

---

### ❌ "pip: command not found"
**Quick Fix:**
```bash
# Use python -m pip instead
python -m pip install -r requirements.txt

# Or try python3
python3 -m pip install -r requirements.txt
```

---

### ❌ "Permission denied" (Linux/Mac)
**Quick Fix:**
```bash
# Activate virtual environment first
source venv/bin/activate

# Then install
pip install -r requirements.txt

# If that fails, use --user
pip install --user -r requirements.txt
```

---

### ❌ "venv: command not found"
**Quick Fix:**
```bash
# Use python -m venv
python -m venv venv

# Or python3
python3 -m venv venv
```

---

### ❌ "Could not locate requirements.txt"
**Quick Fix:**
```bash
# Navigate to backend directory
cd backend

# Check file exists
ls requirements.txt  # Linux/Mac
dir requirements.txt # Windows

# Then install
pip install -r requirements.txt
```

---

## 🔥 Nuclear Option (If Nothing Else Works)

**Windows:**
```batch
cd backend
rmdir /s /q venv
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip setuptools wheel
pip install --no-cache-dir Flask Werkzeug Flask-CORS Flask-Session paho-mqtt python-dotenv
python verify-dependencies.py
```

**Linux/Mac:**
```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install --no-cache-dir Flask Werkzeug Flask-CORS Flask-Session paho-mqtt python-dotenv
python3 verify-dependencies.py
```

---

## ✅ Verify It Works

```bash
# Run verification script
python verify-dependencies.py

# You should see ✅ PASS for all packages
# Then run:
python app.py

# You should see:
# * Running on http://127.0.0.1:5000
```

---

## 📋 Pre-Check Checklist

Before asking for help, verify:

- [ ] Using Python 3.8+: `python --version`
- [ ] Virtual environment created: `ls venv` or `dir venv`
- [ ] Virtual environment activated: Prompt shows `(venv)`
- [ ] In correct directory: `ls app.py` or `dir app.py`
- [ ] requirements.txt exists: `ls requirements.txt` or `dir requirements.txt`
- [ ] Internet connection working
- [ ] No antivirus blocking pip
- [ ] Disk space available (500MB+)

---

## 🎯 Most Common Solution

Most issues are fixed by:

```bash
# 1. Delete old environment
rm -rf venv            # Linux/Mac
rmdir /s venv          # Windows

# 2. Create fresh environment
python -m venv venv

# 3. Activate it
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 4. Upgrade tools
python -m pip install --upgrade pip setuptools wheel

# 5. Install from scratch
pip install --no-cache-dir -r requirements.txt

# 6. Verify
python verify-dependencies.py

# 7. Run
python app.py
```

This works 99% of the time!

---

## 🆘 If You're Still Stuck

1. **Read:** STEP_BY_STEP_INSTALLATION.md (detailed guide)
2. **Read:** INSTALLATION_TROUBLESHOOTING.md (comprehensive help)
3. **Run:** fix-dependencies.bat or fix-dependencies.sh (automatic fix)
4. **Check:** Python 3.8+ installed
5. **Check:** Internet connection working
6. **Try:** Installing packages individually

---

**You'll get it working! Follow the steps above.** ✅
