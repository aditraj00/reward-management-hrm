import React, { useState, useEffect } from 'react';
import { rewardService, attendanceService, authService } from '../services/apiService';
import '../styles/dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Prefer fresh user data from backend (keeps role in sync)
        let userData;
        try {
          const meRes = await authService.getMe();
          userData = meRes.data.user;
          // update localStorage for other pages
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          // fallback to localStorage if /me fails (no token)
          userData = JSON.parse(localStorage.getItem('user'));
        }

        const userId = userData?._id || userData?.id;
        const displayName = userData?.name || [userData?.firstName, userData?.lastName].filter(Boolean).join(' ');

        setUser({ ...userData, id: userId, name: displayName });

        // Fetch various stats
        const [attendanceRes, rewardsRes] = await Promise.all([
          attendanceService.getAttendanceStats(userId),
          rewardService.getReceivedRewards(userId)
        ]);

        setStats({
          attendance: attendanceRes.data.stats,
          rewards: rewardsRes.data.stats
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        <div className="card">
          <h2>Reward Points</h2>
          <div className="stat-value">{user?.rewardPoints || 0}</div>
          <p>Total Points Earned</p>
        </div>

        <div className="card">
          <h2>Attendance</h2>
          <div className="stat-value">{stats?.attendance?.attendancePercentage || 0}%</div>
          <p>Attendance Rate</p>
        </div>

        <div className="card">
          <h2>Badges</h2>
          <div className="stat-value">0</div>
          <p>Badges Earned</p>
        </div>

        <div className="card">
          <h2>Feedback</h2>
          <div className="stat-value">0</div>
          <p>Feedback Received</p>
        </div>
      </div>

      <div className="dashboard-details">
        <div className="detail-section">
          <h2>Attendance Summary</h2>
          {stats?.attendance && (
            <ul>
              <li>Total Days: {stats.attendance.totalDays}</li>
              <li>Present: {stats.attendance.present}</li>
              <li>Absent: {stats.attendance.absent}</li>
              <li>Leave: {stats.attendance.leave}</li>
            </ul>
          )}
        </div>

        <div className="detail-section">
          <h2>Recent Rewards</h2>
          {stats?.rewards?.rewardCount > 0 ? (
            <p>You have earned {stats.rewards.rewardCount} rewards worth {stats.rewards.totalPoints} points</p>
          ) : (
            <p>No rewards yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
