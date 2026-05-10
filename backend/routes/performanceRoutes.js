const express = require('express');
const {
  getAllPerformance,
  createPerformance,
  getEmployeePerformance,
  getPerformanceStats,
  updatePerformance
} = require('../controllers/performanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAllPerformance);
router.post('/', protect, authorize('manager', 'admin'), createPerformance);
router.get('/:employeeId', protect, getEmployeePerformance);
router.get('/stats/:employeeId', protect, getPerformanceStats);
router.put('/:id', protect, authorize('manager', 'admin'), updatePerformance);

module.exports = router;
