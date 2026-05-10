import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h2>🏆 Reward System</h2>
        </div>

        <ul className="nav-menu">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/mark-attendance">Mark Attendance</a></li>
          {isAdmin && (
            <>
              <li><a href="/admin-dashboard">Admin</a></li>
              <li><a href="/manage-users">Users</a></li>
              <li><a href="/manage-attendance">Attendance</a></li>
            </>
          )}
          {!isAdmin && (
            <>
              <li><a href="/leaderboard">Leaderboard</a></li>
              <li><a href="/send-rewards">Give Rewards</a></li>
              <li><a href="/feedback">Feedback</a></li>
            </>
          )}
          <li><a href="/my-profile">My Profile</a></li>
        </ul>

        <div className="navbar-user">
          <span>{user?.name}</span>
          {isAdmin && <span className="admin-badge">Admin</span>}
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
