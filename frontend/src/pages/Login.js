import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/apiService';
import '../styles/auth.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.registered) {
      setSuccessMessage('Registration successful. Please login.');
      // Clear the navigation state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel auth-panel-login">
        <div className="auth-brand">
          <span className="auth-badge">Reward Management</span>
          <h1>Login to your workspace</h1>
          <p>Track attendance, rewards, and team performance from one clean dashboard.</p>
          <div className="auth-highlights">
            <div>
              <strong>Attendance</strong>
              <span>Mark and review records</span>
            </div>
            <div>
              <strong>Rewards</strong>
              <span>See points and bonuses</span>
            </div>
            <div>
              <strong>Profiles</strong>
              <span>Manage employee data</span>
            </div>
          </div>
        </div>

        <div className="auth-box">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in with your email and password</p>

          {successMessage && <div className="success-message">{successMessage}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-auth">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
