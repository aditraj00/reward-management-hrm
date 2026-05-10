const express = require('express');
const {
  getAllAttendance,
  markAttendance,
  getEmployeeAttendance,
  getAttendanceStats,
  updateAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAllAttendance);
router.post('/', protect, authorize('manager', 'admin'), markAttendance);
router.get('/employee/:employeeId', protect, getEmployeeAttendance);
router.get('/stats/:employeeId', protect, getAttendanceStats);
router.put('/:id', protect, authorize('manager', 'admin'), updateAttendance);

module.exports = router;
