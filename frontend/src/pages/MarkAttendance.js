import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/apiService';
import '../styles/mark-attendance.css';

function MarkAttendance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user?.id;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkInTime: '',
    checkOutTime: '',
    remarks: ''
  });

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const [statsRes, attendanceRes] = await Promise.all([
        attendanceService.getAttendanceStats(userId),
        attendanceService.getEmployeeAttendance(userId)
      ]);

      setStats(statsRes.data.stats);
      // Get last 5 records
      setRecentRecords(attendanceRes.data.data.slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.status) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      await attendanceService.markAttendance({
        ...formData,
        employeeId: userId
      });

      setSuccessMessage('Attendance marked successfully! ✓');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        checkInTime: '',
        checkOutTime: '',
        remarks: ''
      });

      // Refresh data
      setTimeout(() => {
        fetchAttendanceData();
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mark-attendance-page">
      <div className="container">
        <div className="header">
          <h1>Mark Attendance</h1>
          <p>Record your daily attendance</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="content-grid">
          {/* Form Section */}
          <div className="form-section">
            <div className="card">
              <h2>Today's Attendance</h2>
              <form onSubmit={handleMarkAttendance}>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <div className="status-options">
                    {['present', 'absent', 'leave', 'half-day'].map(option => (
                      <label key={option} className="radio-option">
                        <input
                          type="radio"
                          name="status"
                          value={option}
                          checked={formData.status === option}
                          onChange={handleFormChange}
                        />
                        <span className={`status-label ${option}`}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.status === 'present' && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Check-in Time</label>
                        <input
                          type="time"
                          name="checkInTime"
                          value={formData.checkInTime}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Check-out Time</label>
                        <input
                          type="time"
                          name="checkOutTime"
                          value={formData.checkOutTime}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Add any additional notes..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading ? 'Marking...' : 'Mark Attendance'}
                </button>
              </form>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            {stats && (
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-label">Total Days</div>
                  <div className="stat-value">{stats.totalDays}</div>
                </div>

                <div className="stat-card present">
                  <div className="stat-label">Present</div>
                  <div className="stat-value">{stats.present}</div>
                </div>

                <div className="stat-card absent">
                  <div className="stat-label">Absent</div>
                  <div className="stat-value">{stats.absent}</div>
                </div>

                <div className="stat-card leave">
                  <div className="stat-label">Leave</div>
                  <div className="stat-value">{stats.leave}</div>
                </div>

                <div className="stat-card attendance">
                  <div className="stat-label">Attendance %</div>
                  <div className="stat-value">{stats.attendancePercentage}%</div>
                </div>
              </div>
            )}

            {/* Recent Records */}
            <div className="card recent-records">
              <h2>Recent Records</h2>
              {recentRecords.length > 0 ? (
                <div className="records-list">
                  {recentRecords.map(record => (
                    <div key={record._id} className="record-item">
                      <div className="record-date">
                        {new Date(record.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="record-status">
                        <span className={`badge ${record.status}`}>
                          {record.status.toUpperCase()}
                        </span>
                      </div>
                      {record.checkInTime && (
                        <div className="record-time">
                          {record.checkInTime} - {record.checkOutTime || 'N/A'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-records">No attendance records yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;
