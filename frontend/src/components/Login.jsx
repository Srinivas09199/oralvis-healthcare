import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('technician');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await axios.post(`${API_URL}/api/auth${endpoint}`, {
        email,
        password,
        role
      }, {
        timeout: 10000
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (isLogin) {
        // Login - redirect directly
        if (user.role === 'technician') {
          navigate('/technician');
        } else if (user.role === 'dentist') {
          navigate('/dentist');
        }
      } else {
        // Registration - show popup
        setPopupMessage(`Registration successful! You are registered as a ${user.role}.`);
        setUserRole(user.role);
        setShowPopup(true);
        
        // Clear form
        setEmail('');
        setPassword('');
        setRole('technician');
      }
    } catch (err) {
      console.error('API error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check if the server is running.');
      } else if (err.response) {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setError('An unexpected error occurred: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (userRole === 'technician') {
      navigate('/technician');
    } else if (userRole === 'dentist') {
      navigate('/dentist');
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-form">
          <h2>{isLogin ? 'Login' : 'Register'} to OralVis Healthcare</h2>
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="login-form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your password"
                minLength="6"
              />
            </div>
            
            <div className="login-form-group">
              <label>Role:</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                <option value="technician">Technician</option>
                <option value="dentist">Dentist</option>
              </select>
            </div>
            
            <button type="submit" className="login-form-button" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          
          <div className="login-form-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span 
                onClick={() => !loading && setIsLogin(!isLogin)} 
                className="login-toggle-link"
              >
                {isLogin ? 'Register' : 'Login'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Registration Success Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-icon">✅</div>
            <h3 className="popup-title">Registration Successful!</h3>
            <p className="popup-message">{popupMessage}</p>
            <button className="popup-button" onClick={handlePopupClose}>
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;