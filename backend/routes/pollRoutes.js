const express = require('express');
const router = express.Router();

const {
  createPoll,
  getPolls,
  getPollById,
  voteOnPoll
  // getPollResults <-- REMOVED (Merged into getPollById)
} = require('../controllers/pollController');

// Middleware
const { protect, authorize } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const { voteLimiter } = require('../middleware/rateLimiter');

// 1. GET /api/polls → Get polls (Filtered by location)
router.get('/', protect, getPolls);

// 2. POST /api/polls → Create poll (Official/Admin only)
router.post('/', protect, authorize('official', 'admin'), createPoll);

// 3. GET /api/polls/:id → Get single poll (Includes Results!)
router.get('/:id', protect, validateObjectId, getPollById);

// 4. POST /api/polls/:id/vote → Vote (Citizen only + Rate Limited)
router.post(
  '/:id/vote',
  protect,
  authorize('citizen'),
  validateObjectId,
  voteLimiter,
  voteOnPoll
);

module.exports = router;