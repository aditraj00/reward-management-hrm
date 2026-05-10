const express = require('express');
const {
  getAllFeedback,
  giveFeedback,
  getEmployeeFeedback,
  getFeedbackStats,
  updateFeedback
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAllFeedback);
router.post('/', protect, giveFeedback);
router.get('/:employeeId', protect, getEmployeeFeedback);
router.get('/stats/:employeeId', protect, getFeedbackStats);
router.put('/:id', protect, updateFeedback);

module.exports = router;
