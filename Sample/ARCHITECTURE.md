# Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                   (http://localhost:3000)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  React Frontend                          │   │
│  │                                                          │   │
│  │  ┌────────────┬──────────────┬─────────────┬───────┐   │   │
│  │  │   Login    │  Dashboard   │   Devices   │Attack │   │   │
│  │  │            │              │             │       │   │   │
│  │  └────────────┴──────────────┴─────────────┴───────┘   │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │           Defense & Logs View                  │   │   │
│  │  │  • Attack Detection Results                    │   │   │
│  │  │  • Security Alerts                             │   │   │
│  │  │  • Event Logs (filtered)                       │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  REST API Calls ↔ MQTT WebSocket                                 │
└───────────────────┬────────────────────┬──────────────────────────┘
                    │                    │
                    ▼                    ▼
        ┌───────────────────┐  ┌────────────────────────┐
        │  Flask Backend    │  │  Mosquitto MQTT Broker │
        │  (Port 5000)      │  │  (Port 1883/9001)      │
        │                   │  │                        │
        │ • Authentication  │  │  Publish/Subscribe:    │
        │ • Authorization   │  │  /devices/light1       │
        │ • Device Control  │  │  /devices/light2       │
        │ • Attack Detect   │  │  /devices/thermostat   │
        │ • Logging         │  │  /devices/lock         │
        │ • API Routes      │  │  /alerts/#             │
        │                   │  │                        │
        └─────────┬─────────┘  └────────────────────────┘
                  │                        ▲
                  │ SQLite Log Events      │
                  ▼                        │
        ┌───────────────────┐     MQTT    │
        │   SQLite DB       │   Messages  │
        │                   │             │
        │ logs Table:       │◄────────────┘
        │ • timestamp       │
        │ • message         │
        │ • log_type        │ (ATTACK,
        │ • severity        │  DEFENSE,
        │ • device          │  DEVICE_UPDATE,
        │ • user            │  AUTH)
        │                   │
        └───────────────────┘
```

---

## Data Flow Diagrams

### 1. Authorized Device Control Flow

```
User → Frontend (Device Controls) → API Call (POST /api/control-device)
                                              ↓
                                    Backend Authorization Check
                                              ↓
                                    AUTHORIZED? ─→ NO → Return 403
                                    ↓ YES
                                    Publish to MQTT
                                    /devices/{device_name}
                                              ↓
                                    MQTT Broker
                                              ↓
                                    Simulate Device Action
                                              ↓
                                    Log Event: DEVICE_UPDATE
                                              ↓
                                    Return Success to Frontend
                                              ↓
                                    Dashboard Updates State
```

### 2. Attack Detection Flow

```
Attacker → Frontend (Attack Tab) → Direct MQTT Publish (BYPASSES BACKEND)
                                              ↓
                                    MQTT Broker
                                              ↓
                                    Backend Receives Message
                                              ↓
                    ┌───────────────────────────────────────┐
                    │   Message Inspection Engine            │
                    │   Check for Attack Patterns:           │
                    │   • attack=true?                       │
                    │   • bypass_auth=true?                  │
                    │   • rapid_fire=true?                   │
                    │   • malformed JSON?                    │
                    └───────────────────────────────────────┘
                                    ↓ SUSPICIOUS DETECTED
                                    ↓
                    ┌───────────────────────────────────┐
                    │   Defense Action Triggered        │
                    │   • Log as ATTACK                 │
                    │   • Set SEVERITY (CRITICAL/WARN)  │
                    │   • Alert User                    │
                    │   • Record Details                │
                    └───────────────────────────────────┘
                                    ↓
                                    Database (logs table)
                                    ↓
                    User sees in Defense & Logs Tab
```

### 3. Real-time Monitoring Flow

```
Frontend (Dashboard) → MQTT Subscribe (/devices/#)
                             ↓
                    MQTT Broker
                             ↓
            [Device Updates] ← Backend publishes
                             ↓
                    React State Updates
                             ↓
                    Component Re-renders
                             ↓
                    User sees Live Device Status
                    
Additionally:
Frontend (Defense Tab) → Auto-refresh Interval (3 seconds)
                             ↓
                    Fetch /api/logs/attack
                             ↓
                    Backend queries SQLite
                             ↓
                    Returns attack logs
                             ↓
                    Display in Real-time
```

---

## Component Interaction Diagram

```
                        ┌─────────────────┐
                        │   App.js        │
                        │ (Main Router)   │
                        └────────┬────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
         ┌──────────────┐ ┌────────────────┐ ┌──────────────┐
         │  Login.js    │ │ Dashboard.js   │ │ Devices.js   │
         │              │ │                │ │              │
         │ • Auth API   │ │ • MQTT Connect │ │ • Device API │
         │ • Session    │ │ • Real-time    │ │ • State Mgmt │
         │ • Routes     │ │   Updates      │ │ • Controls   │
         └──────────────┘ │ • Alerts       │ └──────────────┘
                          └────────────────┘

                ┌────────────────────────────────┐
                │                                │
                ▼                                ▼
         ┌──────────────┐                ┌──────────────┐
         │ Attack.js    │                │ Defense.js   │
         │              │                │              │
         │ • MQTT Pub   │                │ • API Calls  │
         │ • Attack Sim │                │ • Logs Table │
         │ • Target Dev │                │ • Filters    │
         │ • Types      │                │ • Alerts     │
         └──────────────┘                └──────────────┘

All → App.css (Styling) + API Calls to Backend
```

---

## Request/Response Cycle

### 1. Device Control Request

```
REQUEST:
POST /api/control-device
Headers: Content-Type: application/json
Cookies: session=<session_id>
Body: {
  "device": "light1",
  "action": "on"
}

BACKEND:
1. Check session (user authenticated?)
2. Extract user from session
3. Check AUTHORIZED_DEVICES[user][device]
4. If authorized: publish to MQTT
5. Log event to database
6. Return success

RESPONSE:
200 OK
{
  "success": true,
  "message": "Command sent"
}

OR (if unauthorized):
403 Forbidden
{
  "error": "Unauthorized device access"
}
```

### 2. Get Logs Request

```
REQUEST:
GET /api/logs?type=ATTACK&limit=50
Headers: (session cookie included)

BACKEND:
1. Query SQLite logs table
2. Filter by type=ATTACK
3. Order by timestamp DESC
4. Limit 50 results

RESPONSE:
200 OK
{
  "logs": [
    {
      "id": 1,
      "timestamp": "2024-01-15T10:30:45.123456",
      "message": "ATTACK DETECTED: Unauthorized attack flag...",
      "log_type": "ATTACK",
      "device": "light1",
      "severity": "CRITICAL",
      ...
    }
  ]
}
```

---

## Security Architecture

```
┌───────────────────────────────────────────────────────┐
│              Security Layers                          │
└───────────────────────────────────────────────────────┘

Layer 1: Authentication
├─ Session-based authentication
├─ Password validation (backend only)
└─ Session cookie management

Layer 2: Authorization
├─ User-device permission matrix
├─ Backend authorization check
└─ Access control on all API endpoints

Layer 3: Input Validation
├─ MQTT message parsing
├─ Attack pattern detection
├─ Malformed data handling
└─ Sanitization

Layer 4: Detection & Response
├─ Real-time message inspection
├─ Anomaly detection
├─ Pattern matching
└─ Alert generation

Layer 5: Logging & Audit
├─ Comprehensive event logging
├─ Severity classification
├─ Timestamp recording
└─ User/device tracking
```

---

## Database Schema

```
┌──────────────────────────────────────────────┐
│            logs (SQLite Table)               │
├──────────────────────────────────────────────┤
│ id (INTEGER PRIMARY KEY)                     │
├──────────────────────────────────────────────┤
│ timestamp (TEXT) - ISO format                │
│ message (TEXT) - Event description           │
│ log_type (TEXT) - ATTACK/DEFENSE/etc         │
│ source (TEXT) - MQTT topic                   │
│ device (TEXT) - Device name                  │
│ user (TEXT) - User who triggered             │
│ severity (TEXT) - INFO/WARNING/CRITICAL      │
└──────────────────────────────────────────────┘

Indexes:
- Primary: id
- Query: (log_type, timestamp)
- Query: (device, timestamp)
- Query: (user, timestamp)
```

---

## MQTT Topic Structure

```
/devices/
├── light1
│   └── Payload: {"action": "on/off", "user": "username"}
├── light2
│   └── Payload: {"action": "on/off", "user": "username"}
├── thermostat
│   └── Payload: {"action": "20°C", "user": "username"}
└── lock
    └── Payload: {"action": "locked/unlocked", "user": "username"}

Attack Indicators (detected in payload):
├── attack=true              (Explicit attack flag)
├── bypass_auth=true         (Auth bypass attempt)
├── rapid_fire=true          (DoS pattern)
└── Invalid JSON             (Malformed message)

Alert Topics:
└── /alerts/#
    └── Used for publishing alerts to clients
```

---

## Deployment Architecture

### Development Setup
```
LocalHost
├── 0.0.0.0:3000    ← React Frontend
├── 0.0.0.0:5000    ← Flask Backend
├── 0.0.0.0:1883    ← MQTT Broker
└── 0.0.0.0:9001    ← MQTT WebSocket
```

### Docker Deployment
```
Docker Network: smart_home_network
├── Container: smart_home_mqtt_broker
│   ├── Port: 1883:1883
│   ├── Port: 9001:9001
│   └── Volumes: mosquitto_data, mosquitto_logs
└── Container: smart_home_backend (optional)
    ├── Port: 5000:5000
    └── Depends on: mosquitto
```

### Production Deployment
```
Internet
   ↓
Load Balancer (nginx)
   ├─ HTTPS:443 → Frontend (multiple instances)
   └─ API:443 → Backend (multiple instances)
         ↓
   ┌─────┴─────┐
   ↓           ↓
Frontend  Backend Cluster
(React)   (Flask)
          ↓
    MQTT Broker Cluster
          ↓
    Database (PostgreSQL)
```

---

## Scalability Considerations

```
Current (Educational):
- Single user session per browser
- Single MQTT broker
- Single backend instance
- SQLite database

Scale to Production:
- Multi-user authentication (OAuth2)
- MQTT broker cluster (MQTT SN)
- Backend load balancing
- PostgreSQL/MySQL database
- Redis caching layer
- Message queue (RabbitMQ)
- Monitoring (Prometheus/Grafana)
```

---

**Architecture designed for clarity, education, and easy expansion!** 🏗️
