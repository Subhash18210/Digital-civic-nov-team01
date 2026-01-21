const express = require('express');
const router = express.Router();

// Import the controller function
// Make sure your file is named 'reportController.js' inside the controllers folder
const { getReports } = require('../controllers/reportController');

// Import Middleware for security
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/reports
// @desc    Get analytics data (Petitions stats, Trends, Signatures)
// @access  Private (Official Only)
router.get('/', protect, authorize('official'), getReports);

module.exports = router;