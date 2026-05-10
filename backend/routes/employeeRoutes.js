const express = require('express');
const {
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getAllBadges,
  createBadge,
  getEmployeeBadges,
  uploadProfilePicture
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Employee routes
router.get('/', protect, getAllEmployees);

// Badge routes
router.get('/badges/all', protect, getAllBadges);
router.post('/badges', protect, authorize('admin'), createBadge);
router.get('/:id/badges', protect, getEmployeeBadges);

// Profile picture upload
router.post('/:id/upload-profile', protect, upload.single('profilePicture'), uploadProfilePicture);

router.get('/:id', protect, getEmployee);
router.put('/:id', protect, updateEmployee);
router.delete('/:id', protect, authorize('admin'), deleteEmployee);

module.exports = router;
