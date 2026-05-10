import React, { useState, useEffect } from 'react';
import { rewardService, employeeService } from '../services/apiService';
import '../styles/send-rewards.css';

function SendRewards() {
  const [formData, setFormData] = useState({
    receiver: '',
    points: '',
    reason: '',
    category: 'other',
    bonus: 0
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getAllEmployees();
        setEmployees(response.data.data.filter(emp => emp._id !== user.id));
      } catch (err) {
        setError('Failed to fetch employees');
      }
    };

    fetchEmployees();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const rewardData = {
        ...formData,
        points: parseInt(formData.points),
        bonus: parseInt(formData.bonus) || 0
      };
      await rewardService.giveReward(rewardData);
      setSuccess('Reward given successfully! Pending manager approval.');
      setFormData({ receiver: '', points: '', reason: '', category: 'other', bonus: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to give reward');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-rewards">
      <h1>Give Reward to Colleague</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="reward-form">
        <div className="form-group">
          <label>Select Employee *</label>
          <select
            name="receiver"
            value={formData.receiver}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Employee --</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName} ({emp.department})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Reward Points (1-100) *</label>
          <input
            type="number"
            name="points"
            min="1"
            max="100"
            value={formData.points}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="teamwork">Teamwork</option>
            <option value="innovation">Innovation</option>
            <option value="quality">Quality</option>
            <option value="customer-service">Customer Service</option>
            <option value="leadership">Leadership</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Reason for Reward *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Explain why this person deserves the reward..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Bonus Amount (Optional)</label>
          <input
            type="number"
            name="bonus"
            value={formData.bonus}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Submitting...' : 'Submit Reward'}
        </button>
      </form>
    </div>
  );
}

export default SendRewards;
