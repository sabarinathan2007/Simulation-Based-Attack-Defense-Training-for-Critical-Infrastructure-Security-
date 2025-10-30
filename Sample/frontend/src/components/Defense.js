import React, { useState, useEffect } from 'react';

/**
 * Defense Component
 * Displays security logs and alerts, showing system defenses in action
 */
function Defense({ onAlert }) {
  const [logs, setLogs] = useState([]);
  const [attacks, setAttacks] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);

  // Load logs on component mount and refresh periodically
  useEffect(() => {
    loadLogs();
    loadAttacks();

    // Auto-refresh every 3 seconds
    const interval = setInterval(() => {
      loadLogs();
      loadAttacks();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Load all logs from backend
   */
  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/logs?limit=100', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAllLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load attack logs specifically
   */
  const loadAttacks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logs/attack?limit=50', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAttacks(data.attacks || []);
      }
    } catch (error) {
      console.error('Failed to load attacks:', error);
    }
  };

  /**
   * Clear all logs
   */
  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/logs/clear', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setLogs([]);
        setAttacks([]);
        setAllLogs([]);
        onAlert('Logs cleared successfully', 'success');
      }
    } catch (error) {
      console.error('Failed to clear logs:', error);
      onAlert('Failed to clear logs', 'error');
    }
  };

  /**
   * Format timestamp for display
   */
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  /**
   * Get filtered logs based on selected filter type
   */
  const getFilteredLogs = () => {
    switch (filterType) {
      case 'attacks':
        return attacks;
      case 'device_updates':
        return allLogs.filter(log => log.log_type === 'DEVICE_UPDATE');
      case 'auth':
        return allLogs.filter(log => log.log_type === 'AUTH');
      default:
        return allLogs;
    }
  };

  const filteredLogs = getFilteredLogs();

  return (
    <div className="defense-page">
      {/* Security Summary */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🛡️ Security Summary</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              loadLogs();
              loadAttacks();
            }}
            disabled={loading}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            {loading ? '⏳ Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* Total Attacks */}
            <div style={{ padding: '1rem', backgroundColor: '#f8d7da', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#721c24' }}>
                {attacks.length}
              </div>
              <div style={{ color: '#721c24', fontWeight: '500' }}>Attacks Detected</div>
            </div>

            {/* Total Events */}
            <div style={{ padding: '1rem', backgroundColor: '#d1ecf1', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0c5460' }}>
                {allLogs.length}
              </div>
              <div style={{ color: '#0c5460', fontWeight: '500' }}>Total Events</div>
            </div>

            {/* System Status */}
            <div style={{ padding: '1rem', backgroundColor: '#d4edda', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#155724' }}>
                🟢
              </div>
              <div style={{ color: '#155724', fontWeight: '500' }}>System Protected</div>
            </div>

            {/* Latest Alert */}
            <div style={{ padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#856404' }}>
                Last: {attacks.length > 0
                  ? formatTime(attacks[0].timestamp).split(' ')[1]
                  : 'No attacks'
                }
              </div>
              <div style={{ color: '#856404', fontWeight: '500', fontSize: '0.85rem' }}>Alert Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {attacks.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🚨 Critical Security Alerts</h2>
          </div>
          <div className="card-body">
            {attacks.filter(a => a.severity === 'CRITICAL').length > 0 ? (
              <div>
                {attacks.filter(a => a.severity === 'CRITICAL').slice(0, 5).map(alert => (
                  <div
                    key={alert.id}
                    style={{
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      backgroundColor: '#fff5f5',
                      border: '2px solid #e74c3c',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                        ⛔ {alert.severity}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                    <p style={{ margin: '0.5rem 0', color: '#555' }}>{alert.message}</p>
                    {alert.device && (
                      <small style={{ color: '#e74c3c' }}>
                        🎯 Target: <strong>{alert.device}</strong>
                      </small>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#27ae60' }}>✓ No critical alerts</p>
            )}
          </div>
        </div>
      )}

      {/* Logs Filter and Display */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📋 Event Logs</h2>
          <button
            className="btn btn-danger"
            onClick={handleClearLogs}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            Clear Logs
          </button>
        </div>
        <div className="card-body">
          {/* Filter Controls */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('all')}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              All Events ({allLogs.length})
            </button>
            <button
              className={`btn ${filterType === 'attacks' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setFilterType('attacks')}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              Attacks ({attacks.length})
            </button>
            <button
              className={`btn ${filterType === 'device_updates' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('device_updates')}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              Device Updates
            </button>
            <button
              className={`btn ${filterType === 'auth' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('auth')}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              Auth Events
            </button>
          </div>

          {/* Logs Table */}
          <div className="logs-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredLogs.length === 0 ? (
              <p style={{ padding: '1rem', textAlign: 'center', color: '#7f8c8d' }}>
                No logs found for this filter
              </p>
            ) : (
              <table className="logs-table">
                <thead>
                  <tr>
                    <th style={{ width: '180px' }}>Timestamp</th>
                    <th style={{ width: '100px' }}>Type</th>
                    <th style={{ width: '80px' }}>Severity</th>
                    <th style={{ width: '100px' }}>Device</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '0.85rem' }}>
                        {formatTime(log.timestamp)}
                      </td>
                      <td>
                        <span className={`log-type-${log.log_type.toLowerCase()}`}>
                          {log.log_type === 'ATTACK' && '⚠️'}
                          {log.log_type === 'DEFENSE' && '🛡️'}
                          {log.log_type === 'DEVICE_UPDATE' && '🔌'}
                          {log.log_type === 'AUTH' && '🔐'}
                          {' '}{log.log_type}
                        </span>
                      </td>
                      <td>
                        <span className={`severity-${log.severity?.toLowerCase()}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td>
                        {log.device ? <strong>{log.device}</strong> : '—'}
                      </td>
                      <td style={{ fontSize: '0.9rem' }}>
                        {log.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Learning Content */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📖 Understanding the Logs</h2>
        </div>
        <div className="card-body">
          <h4>Log Type Definitions:</h4>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '2', marginTop: '0.5rem' }}>
            <li><strong>⚠️ ATTACK:</strong> Suspicious or malicious activity detected by the system</li>
            <li><strong>🛡️ DEFENSE:</strong> Security action taken by the system in response to a threat</li>
            <li><strong>🔌 DEVICE_UPDATE:</strong> Normal device state change or control command</li>
            <li><strong>🔐 AUTH:</strong> User login/logout or authentication events</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem' }}>Severity Levels:</h4>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '2', marginTop: '0.5rem' }}>
            <li><strong>CRITICAL:</strong> Immediate threat - potential security breach</li>
            <li><strong>WARNING:</strong> Suspicious activity - monitor closely</li>
            <li><strong>INFO:</strong> Normal operation - for audit trail</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem' }}>How to Read the Alerts:</h4>
          <p style={{ marginTop: '0.5rem' }}>
            When you perform an attack from the "Perform Attack" tab, look for corresponding entries in this log.
            Each attack will show:
          </p>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '2', marginTop: '0.5rem' }}>
            <li>The exact timestamp of when it was detected</li>
            <li>What type of attack was attempted</li>
            <li>The target device</li>
            <li>The specific malicious payload or technique used</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Defense;
