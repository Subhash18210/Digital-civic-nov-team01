const express = require('express');
const router = express.Router();

const {
  createPoll,
  getPolls,
  getPollById,
  voteOnPoll,
  getPollResults
} = require('../controllers/pollController');

const { protect, authorize } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const { voteLimiter } = require('../middleware/rateLimiter');

// GET /api/polls → get polls (location-based)
router.get('/', protect, getPolls);

// POST /api/polls → create poll (official/admin)
router.post('/', protect, authorize('official', 'admin'), createPoll);

// GET /api/polls/:id → get single poll
router.get('/:id', protect, validateObjectId, getPollById);

// POST /api/polls/:id/vote → vote (citizen only)
router.post(
  '/:id/vote',
  protect,
  authorize('citizen'),
  validateObjectId,
  voteLimiter,
  voteOnPoll
);

// GET /api/polls/:id/results → aggregated results
router.get('/:id/results', protect, validateObjectId, getPollResults);

module.exports = router;
