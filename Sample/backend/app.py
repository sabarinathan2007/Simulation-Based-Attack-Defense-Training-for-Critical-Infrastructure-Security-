"""
Smart Home Cybersecurity Training Platform - Backend
Main Flask application with MQTT integration, API endpoints, and security features.
"""

from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_session import Session
import sqlite3
import threading
import paho.mqtt.client as mqtt
import json
from datetime import datetime
import logging
import os
import secrets

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(16)  # Generate secure session key
app.config['SESSION_TYPE'] = 'filesystem'

# Enable CORS for frontend communication
CORS(app, supports_credentials=True)

# Initialize session management
Session(app)

# Database configuration
DATABASE = 'smart_home_logs.db'

# MQTT configuration
MQTT_BROKER = 'localhost'  # Change to 'mosquitto' if running in Docker
MQTT_PORT = 1883
MQTT_WEBSOCKET_PORT = 9001

# Global MQTT client
mqtt_client = None

# Authorized devices (demo user has access to all devices)
AUTHORIZED_DEVICES = {
    'user1': ['light1', 'light2', 'thermostat', 'lock'],
    'user2': ['light1']
}

# ==================== DATABASE SETUP ====================

def init_db():
    """Initialize SQLite database with logs table."""
    if not os.path.exists(DATABASE):
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        # Create logs table to store MQTT events, attacks, and defenses
        c.execute('''
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                message TEXT NOT NULL,
                log_type TEXT NOT NULL,
                source TEXT,
                device TEXT,
                user TEXT,
                severity TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")

def log_event(message, log_type, source=None, device=None, user=None, severity='INFO'):
    """
    Log an event to the database.
    Args:
        message: Description of the event
        log_type: 'ATTACK', 'DEFENSE', 'DEVICE_UPDATE', 'AUTH'
        source: Source of the message (e.g., MQTT topic)
        device: Device affected
        user: User who triggered the event
        severity: 'INFO', 'WARNING', 'CRITICAL'
    """
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        timestamp = datetime.now().isoformat()
        c.execute('''
            INSERT INTO logs (timestamp, message, log_type, source, device, user, severity)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (timestamp, message, log_type, source, device, user, severity))
        conn.commit()
        conn.close()
        logger.info(f"[{log_type}] {message}")
    except Exception as e:
        logger.error(f"Error logging event: {e}")

# ==================== MQTT HANDLERS ====================

def on_connect(client, userdata, flags, rc):
    """Callback for when MQTT client connects."""
    if rc == 0:
        logger.info("Connected to MQTT broker")
        # Subscribe to all device topics for monitoring
        client.subscribe('/devices/#')
        log_event("Connected to MQTT broker", "DEVICE_UPDATE")
    else:
        logger.error(f"Failed to connect to MQTT broker with code {rc}")

def on_message(client, userdata, msg):
    """
    Callback for when MQTT message is received.
    Implements attack detection logic.
    """
    topic = msg.topic
    payload = msg.payload.decode()
    
    logger.info(f"MQTT Message - Topic: {topic}, Payload: {payload}")
    
    try:
        # Parse the payload
        data = json.loads(payload) if payload.startswith('{') else {'value': payload}
        
        # Extract device name from topic (e.g., /devices/light1 -> light1)
        device_name = topic.split('/')[-1]
        
        # ==================== ATTACK DETECTION LOGIC ====================
        # Check if this message is authorized
        # For demo purposes: check if the command format is suspicious
        
        is_attack = False
        attack_reason = None
        
        # Rule 1: Check for suspicious commands with 'attack' flag
        if 'attack' in data and data['attack'] is True:
            is_attack = True
            attack_reason = "Unauthorized attack flag detected in payload"
            severity = "CRITICAL"
        
        # Rule 2: Check for commands with bypass authentication flag
        if 'bypass_auth' in data and data['bypass_auth'] is True:
            is_attack = True
            attack_reason = "Attempted to bypass authentication"
            severity = "CRITICAL"
        
        # Rule 3: Detect rapid successive commands (basic DoS detection)
        # This is a simplified version; in production, use proper rate limiting
        if 'rapid_fire' in data and data.get('rapid_fire', False):
            is_attack = True
            attack_reason = "Rapid fire command detected (potential DoS attack)"
            severity = "WARNING"
        
        # ==================== LOG EVENTS ====================
        if is_attack:
            # Log as attack - DEFENSE ACTION
            log_event(
                message=f"ATTACK DETECTED: {attack_reason}. Device: {device_name}, Payload: {payload}",
                log_type="ATTACK",
                source=topic,
                device=device_name,
                severity=severity
            )
            # Broadcast alert to connected clients
            broadcast_alert(f"🚨 Attack Detected: {attack_reason}", severity)
        else:
            # Log as normal device update
            log_event(
                message=f"Device update: {device_name} - {payload}",
                log_type="DEVICE_UPDATE",
                source=topic,
                device=device_name,
                severity="INFO"
            )
    
    except Exception as e:
        logger.error(f"Error processing MQTT message: {e}")

def on_disconnect(client, userdata, rc):
    """Callback for when MQTT client disconnects."""
    if rc != 0:
        logger.warning(f"Unexpected disconnection with code {rc}")

def broadcast_alert(message, severity='INFO'):
    """
    Broadcast security alert to all connected clients.
    In production, use WebSocket or Server-Sent Events (SSE).
    For now, we'll store alerts in a special log table accessed via API.
    """
    log_event(message, "DEFENSE", severity=severity)

# ==================== MQTT CONNECTION ====================

def connect_mqtt():
    """Initialize and connect to MQTT broker."""
    global mqtt_client
    
    try:
        # Create MQTT client - handle both old and new versions
        try:
            # For paho-mqtt 2.0+
            mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, client_id="flask_backend")
        except AttributeError:
            # For paho-mqtt 1.x
            mqtt_client = mqtt.Client(client_id="flask_backend")
        
        mqtt_client.on_connect = on_connect
        mqtt_client.on_message = on_message
        mqtt_client.on_disconnect = on_disconnect
        
        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        
        # Start MQTT loop in a separate thread
        mqtt_thread = threading.Thread(target=mqtt_client.loop_forever, daemon=True)
        mqtt_thread.start()
        
        logger.info("MQTT client connected and loop started")
    except Exception as e:
        logger.error(f"Failed to connect to MQTT: {e}")

# ==================== API ENDPOINTS ====================

@app.route('/api/login', methods=['POST'])
def login():
    """
    User login endpoint.
    Stores user session for authorization checks.
    """
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        # For demo purposes, accept any username with password 'demo'
        if username and password == 'demo':
            session['user'] = username
            session['authorized'] = True
            log_event(
                message=f"User {username} logged in",
                log_type="AUTH",
                user=username,
                severity="INFO"
            )
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': username
            }), 200
        else:
            log_event(
                message=f"Failed login attempt for user {username}",
                log_type="AUTH",
                user=username,
                severity="WARNING"
            )
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    """Logout endpoint - clear user session."""
    try:
        user = session.get('user')
        session.clear()
        log_event(
            message=f"User {user} logged out",
            log_type="AUTH",
            user=user,
            severity="INFO"
        )
        return jsonify({'success': True, 'message': 'Logout successful'}), 200
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/session', methods=['GET'])
def get_session():
    """Get current user session information."""
    try:
        if 'user' in session:
            return jsonify({
                'authenticated': True,
                'user': session['user']
            }), 200
        else:
            return jsonify({'authenticated': False}), 401
    except Exception as e:
        logger.error(f"Session error: {e}")
        return jsonify({'authenticated': False, 'error': str(e)}), 500

@app.route('/api/devices', methods=['GET'])
def get_devices():
    """
    Get list of available devices.
    Returns devices accessible to the current user.
    """
    try:
        user = session.get('user')
        if not user:
            return jsonify({'error': 'Not authenticated'}), 401
        
        # Get authorized devices for user
        devices = AUTHORIZED_DEVICES.get(user, [])
        
        return jsonify({
            'devices': [
                {'name': 'light1', 'type': 'light', 'state': 'off'},
                {'name': 'light2', 'type': 'light', 'state': 'off'},
                {'name': 'thermostat', 'type': 'thermostat', 'state': '20°C'},
                {'name': 'lock', 'type': 'lock', 'state': 'locked'}
            ]
        }), 200
    except Exception as e:
        logger.error(f"Error fetching devices: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/control-device', methods=['POST'])
def control_device():
    """
    Control a device via MQTT.
    Sends command to MQTT topic.
    """
    try:
        user = session.get('user')
        if not user:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        device = data.get('device')
        action = data.get('action')
        
        # Check if user is authorized for this device
        if user not in AUTHORIZED_DEVICES or device not in AUTHORIZED_DEVICES[user]:
            log_event(
                message=f"User {user} attempted unauthorized control of {device}",
                log_type="ATTACK",
                device=device,
                user=user,
                severity="WARNING"
            )
            return jsonify({'error': 'Unauthorized device access'}), 403
        
        # Publish command to MQTT topic
        topic = f'/devices/{device}'
        payload = json.dumps({'action': action, 'user': user})
        
        if mqtt_client:
            mqtt_client.publish(topic, payload)
            log_event(
                message=f"Device control command sent: {device} -> {action}",
                log_type="DEVICE_UPDATE",
                device=device,
                user=user,
                source=topic
            )
            return jsonify({'success': True, 'message': 'Command sent'}), 200
        else:
            return jsonify({'error': 'MQTT connection failed'}), 500
    except Exception as e:
        logger.error(f"Device control error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    """
    Retrieve logs from database.
    Can filter by log_type, device, or user.
    """
    try:
        # Get query parameters for filtering
        log_type = request.args.get('type')
        device = request.args.get('device')
        limit = request.args.get('limit', 100, type=int)
        
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        # Build query with filters
        query = 'SELECT * FROM logs WHERE 1=1'
        params = []
        
        if log_type:
            query += ' AND log_type = ?'
            params.append(log_type)
        
        if device:
            query += ' AND device = ?'
            params.append(device)
        
        query += ' ORDER BY timestamp DESC LIMIT ?'
        params.append(limit)
        
        c.execute(query, params)
        logs = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({'logs': logs}), 200
    except Exception as e:
        logger.error(f"Error fetching logs: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/logs/attack', methods=['GET'])
def get_attack_logs():
    """Get only attack logs (security alerts)."""
    try:
        limit = request.args.get('limit', 50, type=int)
        
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        c.execute('''
            SELECT * FROM logs 
            WHERE log_type = 'ATTACK' 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (limit,))
        
        logs = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({'attacks': logs}), 200
    except Exception as e:
        logger.error(f"Error fetching attack logs: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/logs/clear', methods=['POST'])
def clear_logs():
    """Clear all logs (for demo/reset purposes)."""
    try:
        user = session.get('user')
        if not user:
            return jsonify({'error': 'Not authenticated'}), 401
        
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute('DELETE FROM logs')
        conn.commit()
        conn.close()
        
        log_event(
            message=f"Logs cleared by {user}",
            log_type="DEFENSE",
            user=user,
            severity="INFO"
        )
        
        return jsonify({'success': True, 'message': 'Logs cleared'}), 200
    except Exception as e:
        logger.error(f"Error clearing logs: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({
        'status': 'healthy',
        'mqtt_connected': mqtt_client is not None and mqtt_client.is_connected(),
        'database': 'ok'
    }), 200

# ==================== STARTUP ====================

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Connect to MQTT broker
    connect_mqtt()
    
    # Start Flask app on localhost:5000
    # Note: Use debug=False in production
    app.run(host='0.0.0.0', port=5000, debug=True)
