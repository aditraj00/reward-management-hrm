const RewardPoint = require('../models/RewardPoint');
const User = require('../models/User');
const Badge = require('../models/Badge');

// @desc    Get all reward points
// @route   GET /api/rewards
// @access  Private
exports.getAllRewards = async (req, res) => {
  try {
    const { receiverId, giverId, status } = req.query;
    let filter = {};

    if (receiverId) filter.receiver = receiverId;
    if (giverId) filter.giver = giverId;
    if (status) filter.status = status;

    const rewards = await RewardPoint.find(filter)
      .populate('giver', 'firstName lastName')
      .populate('receiver', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: rewards.length,
      data: rewards
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Give reward points
// @route   POST /api/rewards
// @access  Private
exports.giveReward = async (req, res) => {
  try {
    const { receiver, points, reason, category, bonus } = req.body;

    if (req.user.id === receiver) {
      return res.status(400).json({ success: false, message: 'Cannot give reward to yourself' });
    }

    const reward = await RewardPoint.create({
      giver: req.user.id,
      receiver,
      points,
      reason,
      category,
      bonus: bonus || 0,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: reward
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve reward
// @route   PUT /api/rewards/:id/approve
// @access  Private (Manager/Admin)
exports.approveReward = async (req, res) => {
  try {
    let reward = await RewardPoint.findById(req.params.id);

    if (!reward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }

    if (reward.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending rewards can be approved' });
    }

    reward.status = 'approved';
    reward.approvedBy = req.user.id;
    await reward.save();

    // Update receiver's reward points
    const user = await User.findById(reward.receiver);
    user.rewardPoints += reward.points;
    if (reward.bonus) {
      user.totalBonusAmount += reward.bonus;
    }
    await user.save();

    // Check for badge eligibility
    const badges = await Badge.find({ pointsRequired: { $lte: user.rewardPoints } });
    if (badges.length > 0) {
      user.badges = [...new Set([...user.badges, ...badges.map(b => b._id)])];
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Reward approved successfully',
      data: reward
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject reward
// @route   PUT /api/rewards/:id/reject
// @access  Private (Manager/Admin)
exports.rejectReward = async (req, res) => {
  try {
    let reward = await RewardPoint.findById(req.params.id);

    if (!reward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }

    if (reward.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending rewards can be rejected' });
    }

    reward.status = 'rejected';
    await reward.save();

    res.status(200).json({
      success: true,
      message: 'Reward rejected successfully',
      data: reward
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employee rewards received
// @route   GET /api/rewards/received/:employeeId
// @access  Private
exports.getReceivedRewards = async (req, res) => {
  try {
    const rewards = await RewardPoint.find({ receiver: req.params.employeeId, status: 'approved' })
      .populate('giver', 'firstName lastName');

    const stats = {
      totalPoints: rewards.reduce((sum, r) => sum + r.points, 0),
      totalBonus: rewards.reduce((sum, r) => sum + r.bonus, 0),
      rewardCount: rewards.length
    };

    res.status(200).json({
      success: true,
      stats,
      data: rewards
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get leaderboard (excluding admins)
// @route   GET /api/rewards/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ isActive: true, role: { $ne: 'admin' } })
      .select('firstName lastName email department rewardPoints totalBonusAmount badges')
      .populate('badges')
      .sort({ rewardPoints: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
