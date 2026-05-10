const User = require('../models/User');
const Badge = require('../models/Badge');

// @desc    Get all employees (excluding admins)
// @route   GET /api/employees
// @access  Private
exports.getAllEmployees = async (req, res) => {
  try {
    const { department, role } = req.query;
    let filter = { isActive: true, role: { $ne: 'admin' } };

    if (department) filter.department = department;
    if (role) filter.role = role;

    const employees = await User.find(filter)
      .populate('badges')
      .select('-password');

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id)
      .populate('badges')
      .select('-password');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = async (req, res) => {
  try {
    const { firstName, lastName, department, designation, profilePicture } = req.body;

    let employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Prevent updating sensitive fields
    const updateData = { firstName, lastName, department, designation, profilePicture };

    employee = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete employee (soft delete)
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    let employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.isActive = false;
    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all badges
// @route   GET /api/badges
// @access  Private
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ pointsRequired: 1 });

    res.status(200).json({
      success: true,
      count: badges.length,
      data: badges
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create badge (Admin only)
// @route   POST /api/badges
// @access  Private (Admin)
exports.createBadge = async (req, res) => {
  try {
    const { name, description, icon, requirement, pointsRequired, category } = req.body;

    const badge = await Badge.create({
      name,
      description,
      icon,
      requirement,
      pointsRequired,
      category
    });

    res.status(201).json({
      success: true,
      data: badge
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employee badges
// @route   GET /api/employees/:id/badges
// @access  Private
exports.getEmployeeBadges = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).populate('badges');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      count: employee.badges.length,
      data: employee.badges
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload profile picture
// @route   POST /api/employees/:id/upload-profile
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Construct the file path (accessible via /uploads/)
    const profilePictureUrl = `/uploads/${req.file.filename}`;

    // Update employee with new profile picture
    employee.profilePicture = profilePictureUrl;
    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: profilePictureUrl,
        employee: employee
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
