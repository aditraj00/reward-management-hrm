const express = require('express');
const {
  getAllRewards,
  giveReward,
  approveReward,
  rejectReward,
  getReceivedRewards,
  getLeaderboard
} = require('../controllers/rewardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAllRewards);
router.post('/', protect, giveReward);
router.put('/:id/approve', protect, authorize('manager', 'admin'), approveReward);
router.put('/:id/reject', protect, authorize('manager', 'admin'), rejectReward);
router.get('/received/:employeeId', protect, getReceivedRewards);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
