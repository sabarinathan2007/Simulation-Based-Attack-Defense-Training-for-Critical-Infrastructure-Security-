# 🔧 Installation & Dependency Troubleshooting Guide

## 📋 Problem: Libraries Not Installing from requirements.txt

If you see errors like:
```
ERROR: Could not find a version that satisfies the requirement...
ERROR: No matching distribution found for...
ModuleNotFoundError: No module named '...'
```

Follow this guide to fix it.

---

## ✅ Solution 1: Fresh Installation (Recommended)

### Step 1: Clean Everything
```bash
# Navigate to backend directory
cd backend

# Remove old virtual environment
rm -rf venv

# Remove cached packages (Windows)
rmdir /s __pycache__
del pip-cache

# Remove cached packages (Linux/Mac)
rm -rf __pycache__
rm -rf ~/.cache/pip
```

### Step 2: Create Fresh Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Upgrade pip
```bash
# All platforms
python -m pip install --upgrade pip setuptools wheel
```

### Step 4: Install Requirements
```bash
# Install with verbose output to see what's happening
pip install -r requirements.txt -v

# OR install with no cache
pip install --no-cache-dir -r requirements.txt
```

---

## ✅ Solution 2: Install Packages Individually

If the above doesn't work, install each package separately:

```bash
# Activate virtual environment first
cd backend

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Then install each package
pip install Flask==3.0.0
pip install Werkzeug==3.0.1
pip install Flask-CORS==4.0.0
pip install Flask-Session==0.5.0
pip install paho-mqtt==1.7.1
pip install python-dotenv==1.0.0
```

---

## ✅ Solution 3: Use Compatible Versions

If specific versions don't work, use these tested alternatives:

```bash
# Create a new requirements.txt with flexible versions
pip install Flask
pip install Flask-CORS
pip install Flask-Session
pip install paho-mqtt
pip install python-dotenv

# Then freeze installed versions
pip freeze > requirements.txt
```

---

## 🐛 Specific Error Solutions

### Error: "Could not find a version that satisfies the requirement Flask==2.3.3"
**Solution:** Flask 2.3.3 may be deprecated. Use newer version:
```bash
pip install Flask>=3.0.0
```

### Error: "No matching distribution found for paho-mqtt==1.6.1"
**Solution:** Update to newer version:
```bash
pip install paho-mqtt>=1.7.1
```

### Error: "ModuleNotFoundError: No module named 'flask'"
**Solution:** Virtual environment not activated:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Then verify
pip list
```

### Error: "pip: command not found"
**Solution:** Use python -m pip:
```bash
python -m pip install -r requirements.txt
```

### Error: "Permission denied" on Linux/Mac
**Solution:** Use --user flag or sudo:
```bash
# Option 1: Install for user only
pip install --user -r requirements.txt

# Option 2: Use sudo (not recommended in venv)
sudo pip install -r requirements.txt
```

---

## 📝 Updated requirements.txt

Here's the updated file that works better:

```txt
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

---

## ✅ Verification Steps

After installation, verify everything is installed:

```bash
# Check all packages
pip list

# You should see:
# Flask                    3.0.0
# Flask-CORS               4.0.0
# Flask-Session            0.5.0
# paho-mqtt                1.7.1
# python-dotenv            1.0.0
# Werkzeug                 3.0.1

# Test imports
python -c "import flask; print('Flask OK')"
python -c "import flask_cors; print('Flask-CORS OK')"
python -c "import flask_session; print('Flask-Session OK')"
python -c "import paho.mqtt; print('Paho-MQTT OK')"
python -c "import dotenv; print('python-dotenv OK')"
```

---

## 🚀 Quick Fix Commands

### Windows
```batch
cd backend
rmdir /s venv
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install --no-cache-dir -r requirements.txt
python -c "import flask; print('OK')"
```

### Linux/Mac
```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install --no-cache-dir -r requirements.txt
python -c "import flask; print('OK')"
```

---

## 💡 Pro Tips

1. **Always use virtual environment**
   ```bash
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. **Upgrade pip regularly**
   ```bash
   python -m pip install --upgrade pip
   ```

3. **Use --no-cache-dir for fresh install**
   ```bash
   pip install --no-cache-dir -r requirements.txt
   ```

4. **Check Python version**
   ```bash
   python --version  # Should be 3.8 or higher
   ```

5. **If stuck, use compatible releases**
   ```bash
   pip install Flask
   pip install paho-mqtt
   # Then freeze versions
   pip freeze > requirements.txt
   ```

---

## 🔍 Debugging Checklist

- [x] Virtual environment activated?
- [x] Python 3.8+ installed?
- [x] pip upgraded to latest?
- [x] requirements.txt file exists?
- [x] No typos in file?
- [x] Internet connection working?
- [x] Firewall allowing pip?
- [x] Disk space available?

---

## ❌ Common Mistakes to Avoid

❌ Not activating virtual environment before installing
❌ Using python 2.x instead of python 3
❌ Having old cached packages interfere
❌ Typos in package names
❌ Mixing different virtual environments
❌ Installing without upgrading pip first

---

## 📞 If All Else Fails

Try this nuclear option:

```bash
# 1. Go to backend directory
cd backend

# 2. Delete everything
rm -rf venv *.egg-info dist build  # Linux/Mac
rmdir /s venv  # Windows

# 3. Create fresh environment
python -m venv venv

# 4. Activate it
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 5. Upgrade pip and tools
python -m pip install --upgrade pip setuptools wheel

# 6. Install with verbose output
pip install -r requirements.txt -v

# 7. Test
python app.py
```

---

## ✅ Success Indicators

You'll know it's working when:

```bash
# Running app.py shows:
 * Running on http://127.0.0.1:5000
 * WARNING in app.runserver
 * Debugger is active!

# No import errors
# No "ModuleNotFoundError"
# pip list shows all packages
```

---

## 📖 Platform-Specific Help

### Windows
```bash
# Use PowerShell or Command Prompt
# Make sure python is in PATH
# Try: py instead of python
py -m venv venv
py -m pip install -r requirements.txt
```

### Linux
```bash
# May need to install python3-venv
sudo apt-get install python3-venv

# Then use python3
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

### macOS
```bash
# May need Xcode command line tools
xcode-select --install

# Then use python3
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

---

**Installation fixed! Try again with the updated requirements.txt. Let me know if you hit any other issues!** ✅
