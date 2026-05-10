import React, { useState, useEffect } from 'react';
import { rewardService } from '../services/apiService';
import '../styles/leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await rewardService.getLeaderboard();
        setLeaderboard(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="leaderboard">
      <h1>Top Performers - Leaderboard</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Reward Points</th>
              <th>Bonus Amount</th>
              <th>Badges</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((employee, index) => (
              <tr key={employee._id}>
                <td className={`rank rank-${index + 1}`}>{index + 1}</td>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>{employee.department}</td>
                <td className="points">{employee.rewardPoints}</td>
                <td>₹{employee.totalBonusAmount}</td>
                <td>{employee.badges?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
