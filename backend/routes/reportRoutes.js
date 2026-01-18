const express = require('express');
const router = express.Router();

const {
  generateReports,
  exportReports,
  getAnalytics
} = require('../controllers/reporrController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('official'), generateReports);
router.get('/export', protect, authorize('official'), exportReports);
router.get('/analytics', protect, authorize('official'), getAnalytics);

module.exports = router;
