"""
Dependency Verification Script
Tests if all required packages are properly installed
Run this after installing requirements.txt to verify
"""

import sys
import subprocess

print("=" * 60)
print("🔍 Smart Home Backend - Dependency Verification")
print("=" * 60)
print()

# List of required packages
REQUIRED_PACKAGES = {
    'flask': ('Flask', '3.0.0'),
    'flask_cors': ('Flask-CORS', '4.0.0'),
    'flask_session': ('Flask-Session', '0.5.0'),
    'paho': ('paho-mqtt', '2.1.0'),
    'dotenv': ('python-dotenv', '1.0.0'),
}

# Test results
all_passed = True
installed_packages = []

print("📋 Testing Package Imports:")
print("-" * 60)

for import_name, (package_name, expected_version) in REQUIRED_PACKAGES.items():
    try:
        module = __import__(import_name)
        version = getattr(module, '__version__', 'Unknown')
        installed_packages.append((package_name, version))
        status = "✅ PASS"
        print(f"{status} | {package_name:20} | Version: {version}")
    except ImportError as e:
        all_passed = False
        status = "❌ FAIL"
        print(f"{status} | {package_name:20} | Error: {e}")

print()
print("-" * 60)

# Show pip list
print()
print("📦 Installed Packages (pip list):")
print("-" * 60)
try:
    result = subprocess.run([sys.executable, '-m', 'pip', 'list'], 
                          capture_output=True, text=True)
    
    # Filter for relevant packages
    for line in result.stdout.split('\n'):
        if any(pkg in line.lower() for pkg in ['flask', 'paho', 'dotenv', 'werkzeug', 'click']):
            print(line)
except Exception as e:
    print(f"Error running pip list: {e}")

print()
print("-" * 60)

# Test MQTT connectivity (optional)
print()
print("🌐 Optional: Testing MQTT Connection")
print("-" * 60)

try:
    import paho.mqtt.client as mqtt
    
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("✅ MQTT Broker Connection Test: SUCCESS")
            client.disconnect()
        else:
            print(f"⚠️  MQTT Broker Connection: Failed (code {rc})")
    
    def on_disconnect(client, userdata, rc):
        pass
    
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    
    try:
        client.connect('localhost', 1883, 60)
        client.loop_start()
        import time
        time.sleep(1)
        client.loop_stop()
    except ConnectionRefusedError:
        print("⚠️  MQTT Broker not running on localhost:1883")
        print("    (This is OK if broker not started yet)")
    except Exception as e:
        print(f"⚠️  MQTT Test Error: {e}")
        print("    (This is OK if broker not configured)")

except ImportError:
    print("⚠️  Could not test MQTT (paho-mqtt not installed)")

print()
print("=" * 60)

if all_passed:
    print("✅ VERIFICATION PASSED - All dependencies installed correctly!")
    print()
    print("🚀 You're ready to run:")
    print("   python app.py")
    sys.exit(0)
else:
    print("❌ VERIFICATION FAILED - Some packages are missing!")
    print()
    print("🔧 Fix with:")
    print("   Windows: fix-dependencies.bat")
    print("   Linux/Mac: bash fix-dependencies.sh")
    print()
    print("Or manually install:")
    print("   pip install -r requirements.txt")
    sys.exit(1)
