const Feedback = require('../models/Feedback');
const User = require('../models/User');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private
exports.getAllFeedback = async (req, res) => {
  try {
    const { employeeId, resolved } = req.query;
    let filter = {};

    if (employeeId) filter.employee = employeeId;
    if (resolved !== undefined) filter.isResolved = resolved === 'true';

    const feedback = await Feedback.find(filter)
      .populate('employee', 'firstName lastName email')
      .populate('givenBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Give feedback
// @route   POST /api/feedback
// @access  Private
exports.giveFeedback = async (req, res) => {
  try {
    const { employee, title, content, rating, feedbackType, isAnonymous } = req.body;

    const feedback = await Feedback.create({
      employee,
      givenBy: isAnonymous ? null : req.user.id,
      title,
      content,
      rating,
      feedbackType,
      isAnonymous
    });

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employee feedback
// @route   GET /api/feedback/:employeeId
// @access  Private
exports.getEmployeeFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ employee: req.params.employeeId })
      .populate('givenBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get feedback stats
// @route   GET /api/feedback/stats/:employeeId
// @access  Private
exports.getFeedbackStats = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const feedback = await Feedback.find({ employee: employeeId });

    if (feedback.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          totalFeedback: 0,
          averageRating: 0,
          positiveCount: 0,
          constructiveCount: 0,
          suggestionCount: 0,
          resolvedCount: 0
        }
      });
    }

    const stats = {
      totalFeedback: feedback.length,
      averageRating: (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(2),
      positiveCount: feedback.filter(f => f.feedbackType === 'positive').length,
      constructiveCount: feedback.filter(f => f.feedbackType === 'constructive').length,
      suggestionCount: feedback.filter(f => f.feedbackType === 'suggestion').length,
      resolvedCount: feedback.filter(f => f.isResolved).length
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update feedback (resolve)
// @route   PUT /api/feedback/:id
// @access  Private
exports.updateFeedback = async (req, res) => {
  try {
    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
