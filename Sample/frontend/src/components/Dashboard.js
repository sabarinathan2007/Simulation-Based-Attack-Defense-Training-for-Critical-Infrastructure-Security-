import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

/**
 * Dashboard Component
 * Real-time monitoring of device states and recent alerts
 */
function Dashboard({ user }) {
  const [devices, setDevices] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [client, setClient] = useState(null);

  // Initialize MQTT connection and load data on component mount
  useEffect(() => {
    connectToMQTT();
    loadRecentAlerts();

    // Refresh alerts every 5 seconds
    const alertInterval = setInterval(loadRecentAlerts, 5000);

    return () => {
      clearInterval(alertInterval);
      if (client) {
        client.end();
      }
    };
  }, []);

  /**
   * Connect to MQTT broker via WebSocket
   */
  const connectToMQTT = () => {
    try {
      // Connect to MQTT broker on WebSocket port
      const mqttClient = mqtt.connect('ws://localhost:9001', {
        clientId: `dashboard_${user}_${Math.random().toString(36).substr(2, 9)}`,
        clean: true,
        reconnectPeriod: 1000
      });

      // Handle connection
      mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker');
        setMqttConnected(true);

        // Subscribe to device status topics
        mqttClient.subscribe('/devices/+');
        mqttClient.subscribe('/alerts/#');
      });

      // Handle disconnection
      mqttClient.on('disconnect', () => {
        console.log('Disconnected from MQTT broker');
        setMqttConnected(false);
      });

      // Handle incoming messages
      mqttClient.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          updateDeviceState(topic, payload);
        } catch (e) {
          console.log('Could not parse MQTT message:', message.toString());
        }
      });

      mqttClient.on('error', (error) => {
        console.error('MQTT Error:', error);
      });

      setClient(mqttClient);
    } catch (error) {
      console.error('Failed to connect to MQTT:', error);
    }
  };

  /**
   * Update local device state from MQTT message
   */
  const updateDeviceState = (topic, payload) => {
    setDevices(prevDevices => {
      const deviceName = topic.split('/').pop();
      const existingDevice = prevDevices.find(d => d.name === deviceName);

      if (existingDevice) {
        return prevDevices.map(d =>
          d.name === deviceName ? { ...d, state: payload.action || payload.value || 'unknown' } : d
        );
      }

      return [...prevDevices, {
        name: deviceName,
        type: payload.type || 'unknown',
        state: payload.action || payload.value || 'unknown'
      }];
    });
  };

  /**
   * Load recent alerts from backend
   */
  const loadRecentAlerts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logs/attack?limit=10', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setRecentAlerts(data.attacks || []);
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  /**
   * Format timestamp for display
   */
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="dashboard">
      {/* System Status */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📡 System Status</h2>
          <span className={`device-status ${mqttConnected ? 'on' : 'off'}`}>
            {mqttConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
        <div className="card-body">
          <p><strong>User:</strong> {user}</p>
          <p><strong>MQTT Broker:</strong> ws://localhost:9001</p>
          <p><strong>Connected Devices:</strong> {devices.length}</p>
        </div>
      </div>

      {/* Active Devices */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🔌 Active Devices</h2>
        </div>
        <div className="card-body">
          {devices.length === 0 ? (
            <p style={{ color: '#7f8c8d' }}>No devices currently active. Control devices to see them here.</p>
          ) : (
            <div className="devices-grid" style={{ marginTop: 0 }}>
              {devices.map(device => (
                <div key={device.name} className="device-card">
                  <div className="device-header">
                    <span className="device-name">{device.name}</span>
                    <span className={`device-status ${device.state === 'on' || device.state === 'unlocked' ? 'on' : 'off'}`}>
                      {device.state}
                    </span>
                  </div>
                  <p><small>Type: {device.type}</small></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Security Alerts */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🚨 Recent Security Alerts</h2>
          <button
            className="btn btn-sm"
            onClick={loadRecentAlerts}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            Refresh
          </button>
        </div>
        <div className="card-body">
          {recentAlerts.length === 0 ? (
            <p style={{ color: '#27ae60' }}>✓ No attacks detected</p>
          ) : (
            <div className="logs-container" style={{ padding: 0 }}>
              {recentAlerts.map(alert => (
                <div
                  key={alert.id}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #ecf0f1',
                    backgroundColor: '#fff5f5'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="log-type-attack">⚠️ Attack Detected</span>
                    <span style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>{alert.message}</p>
                  {alert.device && (
                    <small style={{ color: '#e74c3c' }}>
                      Device: <strong>{alert.device}</strong>
                    </small>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📖 How to Use This Platform</h2>
        </div>
        <div className="card-body">
          <ol style={{ marginLeft: '1.5rem', lineHeight: '2' }}>
            <li><strong>Device Controls:</strong> Use the "Device Controls" tab to safely control devices with proper authentication.</li>
            <li><strong>Perform Attack:</strong> In the "Perform Attack" tab, try sending unauthorized MQTT messages to see how the system detects attacks.</li>
            <li><strong>View Logs:</strong> Go to "Defense & Logs" to see all events, attacks detected, and security alerts in real-time.</li>
            <li><strong>Learn:</strong> Each attack attempt is logged with details to help you understand cybersecurity concepts.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
