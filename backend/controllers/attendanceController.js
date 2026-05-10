const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
exports.getAllAttendance = async (req, res) => {
  try {
    const { employeeId, month } = req.query;
    let filter = {};

    if (employeeId) filter.employee = employeeId;
    if (month) {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(filter).populate('employee', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkInTime, checkOutTime, remarks } = req.body;

    // Allow users to mark attendance for themselves or admin/manager to mark for others
    const targetEmployeeId = employeeId || req.user.id;
    if (employeeId && req.user.id !== employeeId && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You can only mark attendance for yourself' });
    }

    // Check if already marked
    const existing = await Attendance.findOne({
      employee: targetEmployeeId,
      date: new Date(date).setHours(0, 0, 0, 0)
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Attendance already marked for this date' });
    }

    const attendance = await Attendance.create({
      employee: targetEmployeeId,
      date: new Date(date),
      status,
      checkInTime,
      checkOutTime,
      remarks
    });

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance by employee
// @route   GET /api/attendance/:employeeId
// @access  Private
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ employee: req.params.employeeId })
      .populate('employee', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance stats
// @route   GET /api/attendance/stats/:employeeId
// @access  Private
exports.getAttendanceStats = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendance = await Attendance.find({ employee: employeeId });

    const stats = {
      totalDays: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      leave: attendance.filter(a => a.status === 'leave').length,
      halfDay: attendance.filter(a => a.status === 'half-day').length
    };

    const attendancePercentage = stats.totalDays ? 
      ((stats.present + stats.halfDay * 0.5) / stats.totalDays * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      stats: {
        ...stats,
        attendancePercentage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private
exports.updateAttendance = async (req, res) => {
  try {
    let attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
