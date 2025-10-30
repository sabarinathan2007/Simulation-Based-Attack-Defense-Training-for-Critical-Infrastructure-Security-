import React, { useState } from 'react';

/**
 * Login Component
 * Handles user authentication with backend API
 */
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle login form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send login request to backend
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login successful
        onLogin(username);
      } else {
        // Login failed
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🏠 Smart Home Security</h1>
        <p className="login-subtitle">Cybersecurity Training Platform</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <small style={{ color: '#7f8c8d', marginTop: '0.5rem', display: 'block' }}>
              Hint: Use password "demo" for any username
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '1.5rem' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#ecf0f1', borderRadius: '4px' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>📚 Demo Accounts:</h4>
          <ul style={{ fontSize: '0.85rem', lineHeight: '1.8', marginLeft: '1.5rem', color: '#555' }}>
            <li><strong>user1</strong> - Full device access</li>
            <li><strong>user2</strong> - Limited device access</li>
            <li><strong>any_username</strong> - Password: demo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
