# Configuration Documentation

## Backend Configuration (app.py)

### MQTT Settings
```python
MQTT_BROKER = 'localhost'      # Change to 'mosquitto' if running in Docker
MQTT_PORT = 1883               # Standard MQTT port
MQTT_WEBSOCKET_PORT = 9001     # For browser WebSocket connections
```

### Device Authorization
```python
AUTHORIZED_DEVICES = {
    'user1': ['light1', 'light2', 'thermostat', 'lock'],
    'user2': ['light1']  # Limited access
}
```
Add or modify user-device mappings here to change authorization.

### Database
```python
DATABASE = 'smart_home_logs.db'
```
SQLite database location. Auto-created on first run.

### Session Management
```python
app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['SESSION_TYPE'] = 'filesystem'
```
Generates secure session keys. Customize in production.

---

## Frontend Configuration

### API Endpoint (package.json)
```json
"proxy": "http://localhost:5000"
```
Backend API URL. Change if backend runs on different host/port.

### MQTT Connection (components/Dashboard.js, etc.)
```javascript
const mqttClient = mqtt.connect('ws://localhost:9001', {
    clientId: `client_${Math.random()}`,
    clean: true,
    reconnectPeriod: 1000
});
```
Change `ws://localhost:9001` if MQTT WebSocket runs elsewhere.

---

## Docker Configuration (docker-compose.yml)

### MQTT Broker Service
```yaml
mosquitto:
  image: eclipse-mosquitto:latest
  ports:
    - "1883:1883"    # MQTT protocol
    - "9001:9001"    # WebSocket
```

### Port Mapping
- **1883**: Standard MQTT (backend uses this)
- **9001**: WebSocket MQTT (frontend uses this)

### Data Persistence
```yaml
volumes:
  - mosquitto_data:/mosquitto/data
  - mosquitto_logs:/mosquitto/log
```
Data persists in Docker volumes even if container stops.

---

## MQTT Broker Configuration (mosquitto.conf)

### Standard MQTT Listener
```
listener 1883
protocol mqtt
```
Used by backend and CLI clients.

### WebSocket Listener
```
listener 9001
protocol websockets
```
Used by browser-based clients (frontend).

### Authentication
```
allow_anonymous true
```
**⚠️ For demo only!** Disable in production.

To enable authentication:
```
allow_anonymous false
password_file /mosquitto/config/passwd.txt
```

### Performance Tuning
```
max_connections -1         # Unlimited connections
max_queued_messages 1000   # Queue size
max_inflight_messages 20   # In-flight messages
```

---

## Environment Variables

Create `.env` file in project root:

```bash
# Backend
FLASK_ENV=development
FLASK_PORT=5000
MQTT_BROKER=localhost

# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MQTT_URL=ws://localhost:9001

# Database
DATABASE_PATH=smart_home_logs.db

# Security
SECRET_KEY=your-secret-key-change-in-production
```

---

## Attack Detection Configuration

### Detection Rules (in app.py on_message function)

#### Rule 1: Attack Flag
```python
if 'attack' in data and data['attack'] is True:
    is_attack = True
    attack_reason = "Unauthorized attack flag detected"
```

#### Rule 2: Bypass Auth
```python
if 'bypass_auth' in data and data['bypass_auth'] is True:
    is_attack = True
    attack_reason = "Attempted to bypass authentication"
```

#### Rule 3: Rapid Fire
```python
if 'rapid_fire' in data and data.get('rapid_fire', False):
    is_attack = True
    attack_reason = "Rapid fire command detected"
```

### Customizing Detection
Edit `/backend/app.py` in the `on_message()` function to:
- Add new detection rules
- Change severity levels
- Modify response actions

---

## Device Configuration

### Available Devices
```python
{
    'name': 'light1',
    'type': 'light',
    'state': 'off'
}

{
    'name': 'thermostat',
    'type': 'thermostat',
    'state': '20°C'
}

{
    'name': 'lock',
    'type': 'lock',
    'state': 'locked'
}
```

### Adding New Devices
1. Add to `AUTHORIZED_DEVICES` mapping in `app.py`
2. Add device card component in `Devices.js`
3. Add MQTT topic subscription (e.g., `/devices/newdevice`)
4. Create frontend controls for the device

---

## Logging Configuration

### Log Levels (app.py)
```python
logging.basicConfig(level=logging.INFO)
```
Change to DEBUG for verbose output.

### Log Destinations
```python
log_dest file /mosquitto/log/mosquitto.log
log_dest stdout
```

### Database Logging
All events logged to SQLite with:
- Timestamp
- Event type (ATTACK, DEFENSE, DEVICE_UPDATE, AUTH)
- Severity (INFO, WARNING, CRITICAL)
- Associated device/user

---

## Security Configuration

### Session Security (app.py)
```python
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False  # True if using HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
```

### CORS (app.py)
```python
CORS(app, supports_credentials=True)
```
Allow frontend to communicate with backend.

### Authorization Checks
```python
if user not in AUTHORIZED_DEVICES or device not in AUTHORIZED_DEVICES[user]:
    return jsonify({'error': 'Unauthorized'}), 403
```

---

## Production Configuration Changes

### Critical Changes Before Production

1. **Enable MQTT Authentication**
   ```bash
   # Create password file
   mosquitto_passwd -c /mosquitto/config/passwd.txt username
   
   # Update mosquitto.conf
   allow_anonymous false
   password_file /mosquitto/config/passwd.txt
   ```

2. **Enable TLS/SSL**
   ```bash
   # Generate certificates
   # Update mosquitto.conf with:
   listener 8883
   protocol mqtt
   cafile /mosquitto/config/ca.crt
   certfile /mosquitto/config/mosquitto.crt
   keyfile /mosquitto/config/mosquitto.key
   ```

3. **Update Flask Config**
   ```python
   app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
   app.config['SESSION_COOKIE_SECURE'] = True
   DEBUG = False
   ```

4. **Database Encryption**
   - Use encrypted database or separate storage layer

5. **API Key/JWT Auth**
   - Replace session-based auth with JWT tokens

6. **Rate Limiting**
   - Add Flask-Limiter for API rate limiting

7. **CORS Restrictions**
   ```python
   CORS(app, resources={
       r"/api/*": {"origins": ["https://yourdomain.com"]}
   })
   ```

8. **HTTPS/SSL**
   - Deploy behind reverse proxy (Nginx)
   - Use valid SSL certificates

9. **Monitoring & Alerting**
   - Add Sentry for error tracking
   - Implement log aggregation
   - Setup alerts for critical events

10. **Regular Backups**
    - Backup SQLite database regularly
    - Store MQTT messages if needed

---

## Scaling Configuration

### For Multiple Users
1. Implement proper authentication (OAuth2/SAML)
2. Implement role-based access control (RBAC)
3. Add user management interface
4. Implement API rate limiting

### For Multiple Devices
1. Implement device discovery
2. Add device groups/zones
3. Implement automation rules
4. Add device status caching

### For High Traffic
1. Migrate to PostgreSQL/MySQL
2. Add Redis caching
3. Use load balancer
4. Implement message queue (RabbitMQ)

---

## Customization Examples

### Add New Attack Type
1. In `app.py`, add detection rule:
```python
if data.get('custom_attack_flag'):
    is_attack = True
    attack_reason = "Custom attack detected"
```

2. In `Attack.js`, add button:
```javascript
const performCustomAttack = () => {
    const payload = JSON.stringify({
        custom_attack_flag: true
    });
    client.publish(`/devices/${targetDevice}`, payload);
};
```

### Change Device Authorization
```python
# app.py - AUTHORIZED_DEVICES
AUTHORIZED_DEVICES = {
    'admin': ['light1', 'light2', 'thermostat', 'lock'],
    'guest': ['light1'],
    'family': ['light1', 'light2', 'thermostat']
}
```

### Add New Device Type
1. Define in devices list
2. Add component in Devices.js
3. Add MQTT handler in backend
4. Add to Dashboard display

---

## Troubleshooting Configuration Issues

### MQTT Not Connecting
- Check `MQTT_BROKER` value matches actual broker host
- Verify ports 1883 (MQTT) and 9001 (WebSocket) are open
- Check firewall settings

### Database Errors
- Delete `smart_home_logs.db` and restart backend
- Check file permissions on database directory

### Authorization Failures
- Verify user exists in `AUTHORIZED_DEVICES`
- Check device name matches exactly
- Check session is valid

### WebSocket Connection Failed
- Ensure WebSocket port 9001 is accessible
- Check MQTT broker is running
- Verify WebSocket listener in mosquitto.conf

---

## Configuration Files Summary

| File | Purpose | Key Settings |
|------|---------|--------------|
| `app.py` | Backend logic | MQTT_BROKER, AUTHORIZED_DEVICES, DATABASE |
| `mosquitto.conf` | MQTT server | Listeners, protocol, auth |
| `docker-compose.yml` | Container setup | Ports, volumes |
| `package.json` | Frontend deps | Proxy URL |
| `.env` | Environment | All configurable values |

---

**All configuration options documented. Customize as needed! 🔧**
