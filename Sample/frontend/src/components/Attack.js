import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

/**
 * Attack Component
 * Demonstrates cybersecurity attacks by publishing unauthorized MQTT messages
 * Educational purpose only!
 */
function Attack({ user, onAlert }) {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [targetDevice, setTargetDevice] = useState('light1');
  const [attackType, setAttackType] = useState('unauthorized_control');
  const [loading, setLoading] = useState(false);

  // Connect to MQTT on component mount
  useEffect(() => {
    connectToMQTT();

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  /**
   * Connect directly to MQTT broker (simulating attacker connection)
   */
  const connectToMQTT = () => {
    try {
      const mqttClient = mqtt.connect('ws://localhost:9001', {
        clientId: `attacker_${Math.random().toString(36).substr(2, 9)}`,
        clean: true
      });

      mqttClient.on('connect', () => {
        console.log('Attack client connected to MQTT');
        setConnected(true);
        onAlert('✓ Connected to MQTT broker (Attack simulator mode)', 'info');
      });

      mqttClient.on('disconnect', () => {
        console.log('Attack client disconnected');
        setConnected(false);
      });

      mqttClient.on('error', (error) => {
        console.error('MQTT Error:', error);
        onAlert('MQTT connection error', 'error');
      });

      setClient(mqttClient);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  /**
   * Attack 1: Unauthorized Device Control
   * Send a command without proper authorization
   */
  const performUnauthorizedControl = async () => {
    if (!client || !connected) {
      onAlert('Not connected to MQTT broker', 'error');
      return;
    }

    setLoading(true);

    try {
      // Send unauthorized command directly to device topic
      // This bypasses the backend authorization check
      const payload = JSON.stringify({
        action: targetDevice.includes('lock') ? 'unlocked' : 'on',
        attack: true, // Flag this as an attack for backend detection
        user: 'unauthorized_attacker',
        timestamp: new Date().toISOString()
      });

      client.publish(`/devices/${targetDevice}`, payload);

      onAlert(
        `⚔️ Attack sent! Unauthorized command published to /${targetDevice}. Check Defense tab to see if it was detected.`,
        'warning'
      );

      console.log('Unauthorized control attack sent to:', targetDevice);
    } catch (error) {
      console.error('Attack error:', error);
      onAlert('Attack failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Attack 2: Authentication Bypass Attempt
   */
  const performBypassAuthAttack = async () => {
    if (!client || !connected) {
      onAlert('Not connected to MQTT broker', 'error');
      return;
    }

    setLoading(true);

    try {
      const payload = JSON.stringify({
        action: 'on',
        bypass_auth: true, // Flag authentication bypass attempt
        user: 'attacker',
        timestamp: new Date().toISOString()
      });

      client.publish(`/devices/${targetDevice}`, payload);

      onAlert(
        `⚔️ Auth bypass attack sent! Attempted to bypass authentication. Check Defense tab.`,
        'warning'
      );

      console.log('Authentication bypass attack sent');
    } catch (error) {
      console.error('Attack error:', error);
      onAlert('Attack failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Attack 3: Rapid Fire DoS Attack
   */
  const performDoSAttack = async () => {
    if (!client || !connected) {
      onAlert('Not connected to MQTT broker', 'error');
      return;
    }

    setLoading(true);

    try {
      // Send multiple rapid messages
      const messages = 5;
      for (let i = 0; i < messages; i++) {
        const payload = JSON.stringify({
          action: i % 2 === 0 ? 'on' : 'off',
          rapid_fire: true, // Flag as rapid fire
          sequence: i,
          timestamp: new Date().toISOString()
        });

        client.publish(`/devices/${targetDevice}`, payload);

        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      onAlert(
        `⚔️ DoS attack sent! ${messages} rapid commands published. Check Defense tab.`,
        'warning'
      );

      console.log('DoS attack completed');
    } catch (error) {
      console.error('Attack error:', error);
      onAlert('Attack failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Attack 4: Malformed Message Attack
   */
  const performMalformedAttack = async () => {
    if (!client || !connected) {
      onAlert('Not connected to MQTT broker', 'error');
      return;
    }

    setLoading(true);

    try {
      // Send malformed/suspicious payload
      const payload = '{invalid json content @#$%}';

      client.publish(`/devices/${targetDevice}`, payload);

      onAlert(
        `⚔️ Malformed message attack sent! Invalid payload published. Check Defense tab.`,
        'warning'
      );

      console.log('Malformed attack sent');
    } catch (error) {
      console.error('Attack error:', error);
      onAlert('Attack failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attack-page">
      {/* Warning Banner */}
      <div className="card" style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #f39c12' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ color: '#856404' }}>⚠️ Attack Simulation Mode</h2>
        </div>
        <div className="card-body">
          <p>
            <strong>IMPORTANT:</strong> This section demonstrates cybersecurity attacks for educational purposes only.
            You will send unauthorized MQTT messages directly to the broker, bypassing normal authorization.
            The backend system should detect these attacks and log them as security alerts.
          </p>
          <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
            Never use these techniques on systems you don't own or have permission to test!
          </p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📡 Attack Status</h2>
          <span className={`device-status ${connected ? 'on' : 'off'}`}>
            {connected ? '🟢 Ready' : '🔴 Not Connected'}
          </span>
        </div>
        <div className="card-body">
          <p>
            <strong>Connection Status:</strong> {connected ? 'Connected to MQTT broker' : 'Disconnected'}
          </p>
          {!connected && (
            <button
              className="btn btn-primary"
              onClick={connectToMQTT}
            >
              Reconnect
            </button>
          )}
        </div>
      </div>

      {/* Target Selection */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🎯 Target Selection</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Target Device</label>
            <select
              className="form-select"
              value={targetDevice}
              onChange={(e) => setTargetDevice(e.target.value)}
              disabled={loading || !connected}
            >
              <option value="light1">💡 Light 1</option>
              <option value="light2">💡 Light 2</option>
              <option value="thermostat">🌡️ Thermostat</option>
              <option value="lock">🔒 Smart Lock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attack Types */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">⚔️ Available Attacks</h2>
        </div>
        <div className="card-body">
          <p style={{ marginBottom: '1.5rem', color: '#555' }}>
            Select an attack type and click the button to execute. Each attack will be published to MQTT.
            Monitor the Defense tab to see how the system detects and responds to the attack.
          </p>

          {/* Attack 1 */}
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>1. Unauthorized Device Control</h4>
            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
              Sends a direct command to a device topic without proper authorization.
              Bypasses backend authentication by going directly to MQTT.
            </p>
            <button
              className="btn btn-danger"
              onClick={performUnauthorizedControl}
              disabled={loading || !connected}
              style={{ width: '100%' }}
            >
              {loading ? '⏳ Executing...' : '⚔️ Execute Unauthorized Control'}
            </button>
          </div>

          {/* Attack 2 */}
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>2. Authentication Bypass</h4>
            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
              Attempts to bypass authentication by setting a special flag in the message.
              System should detect this and flag it as an attack.
            </p>
            <button
              className="btn btn-danger"
              onClick={performBypassAuthAttack}
              disabled={loading || !connected}
              style={{ width: '100%' }}
            >
              {loading ? '⏳ Executing...' : '⚔️ Execute Auth Bypass'}
            </button>
          </div>

          {/* Attack 3 */}
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>3. Denial of Service (DoS)</h4>
            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
              Sends rapid successive commands to flood the device.
              System should detect the abnormal traffic pattern.
            </p>
            <button
              className="btn btn-danger"
              onClick={performDoSAttack}
              disabled={loading || !connected}
              style={{ width: '100%' }}
            >
              {loading ? '⏳ Executing...' : '⚔️ Execute DoS Attack'}
            </button>
          </div>

          {/* Attack 4 */}
          <div style={{ marginBottom: 0, padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>4. Malformed Message</h4>
            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
              Sends an invalid/malformed message to test input validation.
            </p>
            <button
              className="btn btn-danger"
              onClick={performMalformedAttack}
              disabled={loading || !connected}
              style={{ width: '100%' }}
            >
              {loading ? '⏳ Executing...' : '⚔️ Execute Malformed Message'}
            </button>
          </div>
        </div>
      </div>

      {/* Learning Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📚 What You're Learning</h2>
        </div>
        <div className="card-body">
          <h4>MQTT Security Vulnerabilities:</h4>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', marginTop: '0.5rem' }}>
            <li>
              <strong>Unauthorized Access:</strong> Without proper authorization, anyone can publish to device topics
            </li>
            <li>
              <strong>Lack of Encryption:</strong> Messages can be intercepted and modified
            </li>
            <li>
              <strong>DoS Attacks:</strong> Flooding the broker with messages can disrupt service
            </li>
            <li>
              <strong>Input Validation:</strong> Malformed messages can cause unexpected behavior
            </li>
          </ul>

          <h4 style={{ marginTop: '1.5rem' }}>Defense Mechanisms:</h4>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', marginTop: '0.5rem' }}>
            <li>✓ Message inspection and anomaly detection</li>
            <li>✓ Rate limiting and DoS protection</li>
            <li>✓ Input validation and sanitization</li>
            <li>✓ Authentication and authorization checks</li>
            <li>✓ Security logging and alerting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Attack;
