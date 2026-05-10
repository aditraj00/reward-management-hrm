import React, { useState, useEffect } from 'react';
import { adminService } from '../services/apiService';
import '../styles/admin.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getSystemStatistics();
        setStats(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>System Overview & Management</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="stat-number">{stats.users.total}</div>
              <p className="stat-label">Registered Users</p>
            </div>

            <div className="stat-card">
              <h3>Active Users</h3>
              <div className="stat-number">{stats.users.active}</div>
              <p className="stat-label">Currently Active</p>
            </div>

            <div className="stat-card">
              <h3>Administrators</h3>
              <div className="stat-number">{stats.users.admin}</div>
              <p className="stat-label">Admin Users</p>
            </div>

            <div className="stat-card">
              <h3>Managers</h3>
              <div className="stat-number">{stats.users.manager}</div>
              <p className="stat-label">Manager Users</p>
            </div>

            <div className="stat-card">
              <h3>Employees</h3>
              <div className="stat-number">{stats.users.employee}</div>
              <p className="stat-label">Employee Users</p>
            </div>

            <div className="stat-card">
              <h3>Inactive Users</h3>
              <div className="stat-number">{stats.users.inactive}</div>
              <p className="stat-label">Deactivated Users</p>
            </div>
          </div>

          <div className="attendance-overview">
            <h2>Attendance Overview</h2>
            <div className="attendance-cards">
              <div className="attendance-card">
                <h4>Total Records</h4>
                <p className="number">{stats.attendance.total}</p>
              </div>
              <div className="attendance-card present">
                <h4>Present</h4>
                <p className="number">{stats.attendance.present}</p>
              </div>
              <div className="attendance-card absent">
                <h4>Absent</h4>
                <p className="number">{stats.attendance.absent}</p>
              </div>
              <div className="attendance-card leave">
                <h4>Leave</h4>
                <p className="number">{stats.attendance.leave}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
