const mongoose = require('mongoose');
const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

/**
 * @desc    Create a new poll
 * @route   POST /api/polls
 * @access  Private (Official/Admin)
 */
exports.createPoll = async (req, res) => {
  try {
    let { title, options, targetLocation } = req.body;

    if (!title || !options || !targetLocation) {
      return res.status(400).json({
        message: 'Please provide title, options, and target location'
      });
    }

    title = title.trim();
    targetLocation = targetLocation.trim();

    const sanitizedOptions = options
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    if (sanitizedOptions.length < 2) {
      return res.status(400).json({
        message: 'Poll must have at least two valid options'
      });
    }

    const poll = await Poll.create({
      title,
      options: sanitizedOptions,
      targetLocation,
      createdBy: req.user.id
    });

    // ✅ Logging
    console.log('[POLL CREATED]', {
      pollId: poll._id,
      createdBy: req.user.id,
      location: poll.targetLocation,
      time: new Date().toISOString()
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get polls filtered by user location
 * @route   GET /api/polls
 * @access  Private
 */
exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find({
      targetLocation: req.user.location
    }).sort({ createdAt: -1 });

    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single poll by ID
 * @route   GET /api/polls/:id
 * @access  Private
 */
exports.getPollById = async (req, res) => {
  try {
    const pollId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ message: 'Invalid poll ID' });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Vote on a poll
 * @route   POST /api/polls/:id/vote
 * @access  Private (Citizen only)
 */
exports.voteOnPoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const { selectedOption } = req.body;

    if (!selectedOption) {
      return res.status(400).json({ message: 'Please select an option' });
    }

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ message: 'Invalid poll ID' });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (!poll.options.includes(selectedOption)) {
      return res.status(400).json({ message: 'Invalid poll option' });
    }

    const vote = await Vote.create({
      poll: pollId,
      user: req.user.id,
      selectedOption
    });

    // ✅ Logging
    console.log('[VOTE CAST]', {
      pollId,
      votedBy: req.user.id,
      selectedOption,
      time: new Date().toISOString()
    });

    res.status(201).json({
      message: 'Vote submitted successfully',
      vote
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'You have already voted on this poll'
      });
    }

    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get aggregated poll results
 * @route   GET /api/polls/:id/results
 * @access  Private
 */
exports.getPollResults = async (req, res) => {
  try {
    const pollId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ message: 'Invalid poll ID' });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const aggregation = await Vote.aggregate([
      { $match: { poll: new mongoose.Types.ObjectId(pollId) } },
      { $group: { _id: '$selectedOption', count: { $sum: 1 } } }
    ]);

    const totalVotes = aggregation.reduce((s, a) => s + a.count, 0);

    const results = poll.options.map(option => {
      const found = aggregation.find(a => a._id === option);
      const votes = found ? found.count : 0;

      return {
        option,
        votes,
        percentage:
          totalVotes === 0 ? 0 : ((votes / totalVotes) * 100).toFixed(2)
      };
    });

    res.status(200).json({ pollId, totalVotes, results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};