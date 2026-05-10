const Performance = require('../models/Performance');
const User = require('../models/User');

// @desc    Get all performance reviews
// @route   GET /api/performance
// @access  Private
exports.getAllPerformance = async (req, res) => {
  try {
    const { employeeId, month } = req.query;
    let filter = {};

    if (employeeId) filter.employee = employeeId;
    if (month) filter.month = month;

    const performance = await Performance.find(filter)
      .populate('employee', 'firstName lastName email')
      .populate('ratedBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: performance.length,
      data: performance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create performance review
// @route   POST /api/performance
// @access  Private
exports.createPerformance = async (req, res) => {
  try {
    const { employee, rating, month, productivityScore, qualityScore, teamworkScore, communicationScore, comments } = req.body;

    const performance = await Performance.create({
      employee,
      rating,
      ratedBy: req.user.id,
      month,
      productivityScore,
      qualityScore,
      teamworkScore,
      communicationScore,
      comments
    });

    res.status(201).json({
      success: true,
      data: performance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employee performance
// @route   GET /api/performance/:employeeId
// @access  Private
exports.getEmployeePerformance = async (req, res) => {
  try {
    const performance = await Performance.find({ employee: req.params.employeeId })
      .populate('ratedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: performance.length,
      data: performance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get performance stats
// @route   GET /api/performance/stats/:employeeId
// @access  Private
exports.getPerformanceStats = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const performances = await Performance.find({ employee: employeeId });

    if (performances.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          averageRating: 0,
          averageProductivity: 0,
          averageQuality: 0,
          averageTeamwork: 0,
          averageCommunication: 0,
          totalReviews: 0
        }
      });
    }

    const stats = {
      averageRating: (performances.reduce((sum, p) => sum + p.rating, 0) / performances.length).toFixed(2),
      averageProductivity: (performances.reduce((sum, p) => sum + p.productivityScore, 0) / performances.length).toFixed(2),
      averageQuality: (performances.reduce((sum, p) => sum + p.qualityScore, 0) / performances.length).toFixed(2),
      averageTeamwork: (performances.reduce((sum, p) => sum + p.teamworkScore, 0) / performances.length).toFixed(2),
      averageCommunication: (performances.reduce((sum, p) => sum + p.communicationScore, 0) / performances.length).toFixed(2),
      totalReviews: performances.length
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update performance review
// @route   PUT /api/performance/:id
// @access  Private
exports.updatePerformance = async (req, res) => {
  try {
    let performance = await Performance.findById(req.params.id);

    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance record not found' });
    }

    performance = await Performance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: performance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
