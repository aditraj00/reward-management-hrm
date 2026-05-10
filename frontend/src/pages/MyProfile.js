import React, { useState, useEffect } from 'react';
import { employeeService, authService } from '../services/apiService';
import '../styles/profile.css';

const DEFAULT_PROFILE_PIC = '/images/dummy-profile.svg';

function MyProfile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePicError, setProfilePicError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      let currentUser = null;

      try {
        const meResponse = await authService.getMe();
        currentUser = meResponse.data.user;
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (meError) {
        currentUser = JSON.parse(localStorage.getItem('user'));
      }

      const userId = currentUser?._id || currentUser?.id;

      if (!userId) {
        throw new Error('User profile not found');
      }

      const response = await employeeService.getEmployee(userId);
      setEmployee(response.data.data);
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setUploadSuccess('');

      const formData = new FormData();
      formData.append('profilePicture', file);

      const userId = employee?._id || employee?.id;
      const response = await employeeService.uploadProfilePicture(userId, formData);

      // Update employee data with new profile picture
      setEmployee(response.data.data.employee);
      setProfilePicError(false);
      setUploadSuccess('Profile picture updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-page-title">
        <h1>My Profile</h1>
        <p>View your profile, rewards, and badges</p>
      </div>
      {error && <div className="error-message">{error}</div>}
      {uploadSuccess && <div className="success-message">{uploadSuccess}</div>}

      {employee && (
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-pic-container">
              <div className="profile-pic">
                <img
                  src={!profilePicError && employee.profilePicture ? employee.profilePicture : DEFAULT_PROFILE_PIC}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  onError={() => setProfilePicError(true)}
                />
              </div>
              <label className="upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
                <span className="upload-btn">
                  {uploading ? 'Uploading...' : '📷 Change Photo'}
                </span>
              </label>
            </div>
            <div className="profile-info">
              <h2>{employee.firstName} {employee.lastName}</h2>
              <p className="designation">{employee.designation}</p>
              {employee.department !== 'Administration' && (
                <p className="department">{employee.department}</p>
              )}
              <p className="email">{employee.email}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <div className="stat-label">Reward Points</div>
              <div className="stat-value">{employee.rewardPoints}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Total Bonus</div>
              <div className="stat-value">₹{employee.totalBonusAmount}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Badges</div>
              <div className="stat-value">{employee.badges?.length || 0}</div>
            </div>
          </div>

          {employee.badges && employee.badges.length > 0 && (
            <div className="badges-section">
              <h3>My Badges</h3>
              <div className="badges-grid">
                {employee.badges.map(badge => (
                  <div key={badge._id} className="badge">
                    <span className="badge-emoji">🏅</span>
                    <h4>{badge.name}</h4>
                    <p>{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyProfile;
