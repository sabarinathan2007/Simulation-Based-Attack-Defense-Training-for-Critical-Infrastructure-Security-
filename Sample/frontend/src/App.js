import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Devices from './components/Devices';
import Attack from './components/Attack';
import Defense from './components/Defense';

/**
 * Main App Component
 * Manages routing between different pages and authentication state
 */
function App() {
  // State management
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [alertMessage, setAlertMessage] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  /**
   * Check if user is authenticated by querying backend session endpoint
   */
  const checkAuthentication = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/session', {
        credentials: 'include' // Include cookies for session
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setAuthenticated(true);
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
    }
  };

  /**
   * Handle user login
   */
  const handleLogin = (username) => {
    setAuthenticated(true);
    setUser(username);
    setCurrentPage('dashboard');
    showAlert(`Welcome, ${username}!`, 'success');
  };

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      setAuthenticated(false);
      setUser(null);
      setCurrentPage('dashboard');
      showAlert('Logged out successfully', 'info');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Show alert message to user
   */
  const showAlert = (message, type) => {
    setAlertMessage({ message, type });
    setTimeout(() => setAlertMessage(null), 5000);
  };

  // If not authenticated, show login page
  if (!authenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Render main application with navigation
  return (
    <div className="app-container">
      {/* Header Navigation */}
      <header className="app-header">
        <div className="header-content">
          <h1>🏠 Smart Home Cybersecurity Training</h1>
          <div className="header-right">
            <span className="user-info">Logged in as: <strong>{user}</strong></span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Alert Message Display */}
      {alertMessage && (
        <div className={`alert alert-${alertMessage.type}`}>
          {alertMessage.message}
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="main-nav">
        <button
          className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentPage('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-btn ${currentPage === 'devices' ? 'active' : ''}`}
          onClick={() => setCurrentPage('devices')}
        >
          🔌 Device Controls
        </button>
        <button
          className={`nav-btn ${currentPage === 'attack' ? 'active' : ''}`}
          onClick={() => setCurrentPage('attack')}
        >
          ⚔️ Perform Attack
        </button>
        <button
          className={`nav-btn ${currentPage === 'defense' ? 'active' : ''}`}
          onClick={() => setCurrentPage('defense')}
        >
          🛡️ Defense & Logs
        </button>
      </nav>

      {/* Page Content */}
      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard user={user} />}
        {currentPage === 'devices' && <Devices user={user} onAlert={showAlert} />}
        {currentPage === 'attack' && <Attack user={user} onAlert={showAlert} />}
        {currentPage === 'defense' && <Defense onAlert={showAlert} />}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Educational Platform | Smart Home & IoT Cybersecurity Training</p>
      </footer>
    </div>
  );
}

export default App;
