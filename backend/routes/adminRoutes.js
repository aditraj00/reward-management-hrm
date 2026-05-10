const express = require('express');
const { 
  getAllUsers,
  getUserDetails,
  markAttendanceForEmployee,
  markBulkAttendance,
  getAllAttendanceRecords,
  getAttendanceSummary,
  getSystemStatistics
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
  }
  next();
};

// Apply protect middleware to all admin routes
router.use(protect);
router.use(adminOnly);

// User management
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);

// Attendance management
router.post('/mark-attendance', markAttendanceForEmployee);
router.post('/mark-attendance-bulk', markBulkAttendance);
router.get('/attendance', getAllAttendanceRecords);
router.get('/attendance-summary', getAttendanceSummary);

// Statistics
router.get('/statistics', getSystemStatistics);

module.exports = router;
