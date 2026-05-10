import api from './api';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const employeeService = {
  getAllEmployees: (filters) => api.get('/employees', { params: filters }),
  getEmployee: (id) => api.get(`/employees/${id}`),
  updateEmployee: (id, data) => api.put(`/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
  getBadges: () => api.get('/employees/badges/all'),
  getEmployeeBadges: (id) => api.get(`/employees/${id}/badges`),
  uploadProfilePicture: (id, formData) => api.post(`/employees/${id}/upload-profile`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const attendanceService = {
  getAllAttendance: (filters) => api.get('/attendance', { params: filters }),
  markAttendance: (data) => api.post('/attendance', data),
  getEmployeeAttendance: (employeeId) => api.get(`/attendance/employee/${employeeId}`),
  getAttendanceStats: (employeeId) => api.get(`/attendance/stats/${employeeId}`),
  updateAttendance: (id, data) => api.put(`/attendance/${id}`, data)
};

export const performanceService = {
  getAllPerformance: (filters) => api.get('/performance', { params: filters }),
  createPerformance: (data) => api.post('/performance', data),
  getEmployeePerformance: (employeeId) => api.get(`/performance/${employeeId}`),
  getPerformanceStats: (employeeId) => api.get(`/performance/stats/${employeeId}`),
  updatePerformance: (id, data) => api.put(`/performance/${id}`, data)
};

export const rewardService = {
  getAllRewards: (filters) => api.get('/rewards', { params: filters }),
  giveReward: (data) => api.post('/rewards', data),
  approveReward: (id) => api.put(`/rewards/${id}/approve`),
  rejectReward: (id) => api.put(`/rewards/${id}/reject`),
  getReceivedRewards: (employeeId) => api.get(`/rewards/received/${employeeId}`),
  getLeaderboard: () => api.get('/rewards/leaderboard')
};

export const feedbackService = {
  getAllFeedback: (filters) => api.get('/feedback', { params: filters }),
  giveFeedback: (data) => api.post('/feedback', data),
  getEmployeeFeedback: (employeeId) => api.get(`/feedback/${employeeId}`),
  getFeedbackStats: (employeeId) => api.get(`/feedback/stats/${employeeId}`),
  updateFeedback: (id, data) => api.put(`/feedback/${id}`, data)
};

export const adminService = {
  getAllUsers: (filters) => api.get('/admin/users', { params: filters }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  markAttendanceForEmployee: (data) => api.post('/admin/mark-attendance', data),
  markBulkAttendance: (data) => api.post('/admin/mark-attendance-bulk', data),
  getAllAttendanceRecords: (filters) => api.get('/admin/attendance', { params: filters }),
  getAttendanceSummary: (filters) => api.get('/admin/attendance-summary', { params: filters }),
  getSystemStatistics: () => api.get('/admin/statistics')
};
