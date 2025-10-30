import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

/**
 * Devices Component
 * Safe device control with proper authorization
 */
function Devices({ user, onAlert }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);

  // Load available devices on component mount
  useEffect(() => {
    loadDevices();
    connectToMQTT();

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  /**
   * Connect to MQTT broker
   */
  const connectToMQTT = () => {
    try {
      const mqttClient = mqtt.connect('ws://localhost:9001', {
        clientId: `devices_${user}_${Math.random().toString(36).substr(2, 9)}`,
        clean: true
      });

      mqttClient.on('connect', () => {
        console.log('Connected to MQTT');
        mqttClient.subscribe('/devices/#');
      });

      mqttClient.on('message', (topic, message) => {
        console.log(`Message on ${topic}:`, message.toString());
      });

      setClient(mqttClient);
    } catch (error) {
      console.error('MQTT connection failed:', error);
    }
  };

  /**
   * Load available devices from backend
   */
  const loadDevices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/devices', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setDevices(data.devices || []);
      } else {
        onAlert('Failed to load devices', 'error');
      }
    } catch (error) {
      console.error('Failed to load devices:', error);
      onAlert('Error loading devices', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send authorized device control command to backend
   */
  const handleControlDevice = async (deviceName, action) => {
    try {
      // Send command through backend API for authorization check
      const response = await fetch('http://localhost:5000/api/control-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          device: deviceName,
          action: action
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onAlert(`✓ ${deviceName} set to ${action}`, 'success');
        
        // Update local device state
        setDevices(prevDevices =>
          prevDevices.map(d =>
            d.name === deviceName ? { ...d, state: action } : d
          )
        );
      } else {
        onAlert(data.error || data.message || 'Control failed', 'error');
      }
    } catch (error) {
      console.error('Device control error:', error);
      onAlert('Network error', 'error');
    }
  };

  /**
   * Handle light toggle
   */
  const toggleLight = (deviceName, currentState) => {
    const newState = currentState === 'off' ? 'on' : 'off';
    handleControlDevice(deviceName, newState);
  };

  /**
   * Handle thermostat change
   */
  const changeThermostat = (deviceName, newTemp) => {
    handleControlDevice(deviceName, `${newTemp}°C`);
  };

  /**
   * Handle lock toggle
   */
  const toggleLock = (deviceName, currentState) => {
    const newState = currentState === 'locked' ? 'unlocked' : 'locked';
    handleControlDevice(deviceName, newState);
  };

  if (loading) {
    return <div className="card">Loading devices...</div>;
  }

  return (
    <div className="devices-page">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🔌 Device Controls</h2>
          <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Authorized User: {user}</span>
        </div>
        <div className="card-body">
          <p style={{ marginBottom: '1.5rem', color: '#555' }}>
            Use the controls below to safely manage your smart home devices. All commands are authorized and logged.
          </p>

          <div className="devices-grid">
            {devices.map(device => (
              <div key={device.name} className="device-card">
                <div className="device-header">
                  <span className="device-name">
                    {device.type === 'light' && '💡'}
                    {device.type === 'thermostat' && '🌡️'}
                    {device.type === 'lock' && '🔒'}
                    {' '}{device.name}
                  </span>
                  <span className={`device-status ${device.state === 'on' || device.state === 'unlocked' ? 'on' : 'off'}`}>
                    {device.state}
                  </span>
                </div>

                {/* Light Controls */}
                {device.type === 'light' && (
                  <div className="device-controls">
                    <button
                      className={`btn ${device.state === 'on' ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleLight(device.name, device.state)}
                      style={{ flex: 1 }}
                    >
                      {device.state === 'on' ? 'Turn Off' : 'Turn On'}
                    </button>
                  </div>
                )}

                {/* Thermostat Controls */}
                {device.type === 'thermostat' && (
                  <div>
                    <div className="device-controls">
                      <button
                        className="btn btn-primary"
                        onClick={() => changeThermostat(device.name, '18')}
                        style={{ flex: 1 }}
                      >
                        Cool (18°C)
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => changeThermostat(device.name, '22')}
                        style={{ flex: 1, marginLeft: '0.5rem' }}
                      >
                        Warm (22°C)
                      </button>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="30"
                      defaultValue="20"
                      className="device-slider"
                      onChange={(e) => changeThermostat(device.name, e.target.value)}
                    />
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'center' }}>
                      Set: {device.state}
                    </p>
                  </div>
                )}

                {/* Lock Controls */}
                {device.type === 'lock' && (
                  <div className="device-controls">
                    <button
                      className={`btn ${device.state === 'locked' ? 'btn-success' : 'btn-danger'}`}
                      onClick={() => toggleLock(device.name, device.state)}
                      style={{ flex: 1 }}
                    >
                      {device.state === 'locked' ? 'Unlock' : 'Lock'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.1rem' }}>✓ Authorized Access</h3>
        </div>
        <div className="card-body">
          <p>All commands you send here are:</p>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>✓ Properly authenticated with your user session</li>
            <li>✓ Authorized for the current user</li>
            <li>✓ Logged and traceable</li>
            <li>✓ Safe and secure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Devices;
