import React, { useState, useEffect } from 'react';
import { adminService } from '../services/apiService';
import '../styles/admin.css';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    isActive: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers(filters);
      setUsers(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const viewUserDetails = async (userId) => {
    try {
      const response = await adminService.getUserDetails(userId);
      setSelectedUser(response.data.data);
      setShowDetails(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manage-users">
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>View all registered users and signup persons</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <div className="filter-group">
          <label>Role:</label>
          <select name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select name="isActive" value={filters.isActive} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={fetchUsers}>
          Apply Filters
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user._id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                  <td>{user.department}</td>
                  <td>{user.designation}</td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-small btn-info"
                      onClick={() => viewUserDetails(user._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDetails && selectedUser && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={closeDetails}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{selectedUser.firstName} {selectedUser.lastName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Role:</span>
                <span className="value">{selectedUser.role}</span>
              </div>
              <div className="detail-row">
                <span className="label">Department:</span>
                <span className="value">{selectedUser.department}</span>
              </div>
              <div className="detail-row">
                <span className="label">Designation:</span>
                <span className="value">{selectedUser.designation}</span>
              </div>
              <div className="detail-row">
                <span className="label">Reward Points:</span>
                <span className="value">{selectedUser.rewardPoints}</span>
              </div>
              <div className="detail-row">
                <span className="label">Total Bonus:</span>
                <span className="value">${selectedUser.totalBonusAmount}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value">{selectedUser.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Joined:</span>
                <span className="value">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
