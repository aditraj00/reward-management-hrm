import React, { useState, useEffect, useCallback } from 'react';
import { adminService, employeeService } from '../services/apiService';
import '../styles/admin.css';

function ManageAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('mark'); // 'mark' or 'view'
  
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkInTime: '',
    checkOutTime: '',
    remarks: ''
  });

  const [filters, setFilters] = useState({
    employeeId: '',
    month: new Date().toISOString().slice(0, 7),
    status: ''
  });

  const [summary, setSummary] = useState([]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getAllEmployees({ role: '' });
      setEmployees(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchAttendanceRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllAttendanceRecords(filters);
      setAttendanceRecords(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchAttendanceSummary = useCallback(async () => {
    try {
      const response = await adminService.getAttendanceSummary({ month: filters.month });
      setSummary(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  }, [filters.month]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (activeTab === 'view') {
      fetchAttendanceRecords();
      fetchAttendanceSummary();
    }
  }, [activeTab, fetchAttendanceRecords, fetchAttendanceSummary]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.date || !formData.status) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await adminService.markAttendanceForEmployee(formData);
      setError('');
      alert('Attendance marked successfully!');
      setFormData({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        checkInTime: '',
        checkOutTime: '',
        remarks: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-attendance">
      <div className="page-header">
        <h1>Manage Attendance</h1>
        <p>Mark and view attendance for all employees</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'mark' ? 'active' : ''}`}
          onClick={() => setActiveTab('mark')}
        >
          Mark Attendance
        </button>
        <button 
          className={`tab ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Attendance
        </button>
      </div>

      {activeTab === 'mark' && (
        <div className="mark-attendance-section">
          <form onSubmit={handleMarkAttendance} className="attendance-form">
            <div className="form-group">
              <label>Employee *</label>
              <select 
                name="employeeId" 
                value={formData.employeeId} 
                onChange={handleFormChange}
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName} - {emp.designation}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleFormChange}
                  required
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                  <option value="half-day">Half Day</option>
                </select>
              </div>
            </div>

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

            <div className="form-group">
              <label>Remarks</label>
              <textarea 
                name="remarks" 
                value={formData.remarks} 
                onChange={handleFormChange}
                rows="3"
                placeholder="Add any remarks..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Mark Attendance'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'view' && (
        <div className="view-attendance-section">
          <div className="filters">
            <div className="filter-group">
              <label>Month:</label>
              <input 
                type="month" 
                name="month" 
                value={filters.month} 
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="leave">Leave</option>
                <option value="half-day">Half Day</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={fetchAttendanceRecords}>
              Apply Filters
            </button>
          </div>

          <div className="attendance-summary">
            <h2>Attendance Summary - {filters.month}</h2>
            <div className="summary-table-container">
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Designation</th>
                    <th>Total Days</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Leave</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.length > 0 ? (
                    summary.map((emp, index) => (
                      <tr key={emp.employee?._id || `summary-${index}`}>
                        <td>{emp.employee ? `${emp.employee.firstName} ${emp.employee.lastName}` : 'Unknown employee'}</td>
                        <td>{emp.employee?.designation || '-'}</td>
                        <td>{emp.total}</td>
                        <td className="present-count">{emp.present}</td>
                        <td className="absent-count">{emp.absent}</td>
                        <td className="leave-count">{emp.leave}</td>
                        <td className="percentage">{emp.percentage}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="attendance-records">
            <h2>Detailed Records</h2>
            <div className="records-table-container">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record) => (
                      <tr key={record._id}>
                        <td>{record.employee ? `${record.employee.firstName} ${record.employee.lastName}` : 'Unknown employee'}</td>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td><span className={`status-badge ${record.status}`}>{record.status}</span></td>
                        <td>{record.checkInTime || '-'}</td>
                        <td>{record.checkOutTime || '-'}</td>
                        <td>{record.remarks || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAttendance;
