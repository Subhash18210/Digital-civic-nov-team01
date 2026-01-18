const express = require('express');
const router = express.Router();

const {
  getPetitionsForOfficial,
  respondToPetition
} = require('../controllers/governanceController');

const { protect, authorize } = require('../middleware/authMiddleware');

// 🔹 Get petitions for officials (location + status filtered)
router.get(
  '/petitions',
  protect,
  authorize('official'),
  getPetitionsForOfficial
);

// 🔹 Official responds to a petition
router.post(
  '/petitions/:id/respond',
  protect,
  authorize('official'),
  respondToPetition
);

module.exports = router;
