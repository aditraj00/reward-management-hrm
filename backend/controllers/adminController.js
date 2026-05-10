const User = require('../models/User');
const Attendance = require('../models/Attendance');

// @desc    Get all users (login/signup persons)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, department, isActive } = req.query;
    let filter = {};

    if (role) filter.role = role;
    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user login/signup history
// @route   GET /api/admin/users/:userId
// @access  Private (Admin only)
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('badges');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark attendance for any employee (Admin only)
// @route   POST /api/admin/mark-attendance
// @access  Private (Admin only)
exports.markAttendanceForEmployee = async (req, res) => {
  try {
    const { employeeId, date, status, checkInTime, checkOutTime, remarks } = req.body;

    // Validate
    if (!employeeId || !date || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide employeeId, date, and status' 
      });
    }

    // Check if employee exists
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Check if already marked
    const existing = await Attendance.findOne({
      employee: employeeId,
      date: new Date(date).setHours(0, 0, 0, 0)
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Attendance already marked for this date' });
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      date: new Date(date),
      status,
      checkInTime,
      checkOutTime,
      remarks
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('employee', 'firstName lastName email designation');

    res.status(201).json({
      success: true,
      data: populatedAttendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark bulk attendance for multiple employees
// @route   POST /api/admin/mark-attendance-bulk
// @access  Private (Admin only)
exports.markBulkAttendance = async (req, res) => {
  try {
    const { attendanceRecords } = req.body;

    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of attendance records' 
      });
    }

    const results = [];
    const errors = [];

    for (const record of attendanceRecords) {
      try {
        const { employeeId, date, status, checkInTime, checkOutTime, remarks } = record;

        // Check if employee exists
        const employee = await User.findById(employeeId);
        if (!employee) {
          errors.push({ employeeId, error: 'Employee not found' });
          continue;
        }

        // Check if already marked
        const existing = await Attendance.findOne({
          employee: employeeId,
          date: new Date(date).setHours(0, 0, 0, 0)
        });

        if (existing) {
          errors.push({ employeeId, error: 'Attendance already marked for this date' });
          continue;
        }

        const attendance = await Attendance.create({
          employee: employeeId,
          date: new Date(date),
          status,
          checkInTime,
          checkOutTime,
          remarks
        });

        results.push(attendance);
      } catch (err) {
        errors.push({ employeeId: record.employeeId, error: err.message });
      }
    }

    res.status(201).json({
      success: true,
      created: results.length,
      errors: errors,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all attendance records (Admin view)
// @route   GET /api/admin/attendance
// @access  Private (Admin only)
exports.getAllAttendanceRecords = async (req, res) => {
  try {
    const { employeeId, month, status } = req.query;
    let filter = {};

    if (employeeId) filter.employee = employeeId;
    if (status) filter.status = status;
    if (month) {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(filter)
      .populate('employee', 'firstName lastName email designation department')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance summary for all employees
// @route   GET /api/admin/attendance-summary
// @access  Private (Admin only)
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { month } = req.query;
    let filter = {};

    if (month) {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await Attendance.find(filter)
      .populate('employee', 'firstName lastName email designation department');

    // Group by employee
    const summary = {};
    attendanceRecords.forEach(record => {
      const empId = record.employee._id.toString();
      if (!summary[empId]) {
        summary[empId] = {
          employee: record.employee,
          total: 0,
          present: 0,
          absent: 0,
          leave: 0,
          halfDay: 0,
          percentage: 0
        };
      }
      summary[empId].total += 1;
      summary[empId][record.status] = (summary[empId][record.status] || 0) + 1;
    });

    // Calculate percentages
    Object.values(summary).forEach(emp => {
      emp.percentage = emp.total ? ((emp.present + emp.halfDay * 0.5) / emp.total * 100).toFixed(2) : 0;
    });

    res.status(200).json({
      success: true,
      count: Object.keys(summary).length,
      data: Object.values(summary)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin only)
exports.getSystemStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const managerCount = await User.countDocuments({ role: 'manager' });
    const employeeCount = await User.countDocuments({ role: 'employee' });
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    const totalAttendance = await Attendance.countDocuments();
    const presentCount = await Attendance.countDocuments({ status: 'present' });
    const absentCount = await Attendance.countDocuments({ status: 'absent' });
    const leaveCount = await Attendance.countDocuments({ status: 'leave' });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admin: adminCount,
          manager: managerCount,
          employee: employeeCount,
          active: activeUsers,
          inactive: inactiveUsers
        },
        attendance: {
          total: totalAttendance,
          present: presentCount,
          absent: absentCount,
          leave: leaveCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
