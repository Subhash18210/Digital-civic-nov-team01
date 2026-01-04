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
    // 🔒 SECURITY: Role Check (Checklist Item 2.1 & 4)
    if (req.user.role !== 'official') {
      return res.status(403).json({ message: 'Access denied. Only officials can create polls.' });
    }

    let { title, options, targetLocation } = req.body;

    if (!title || !options || !targetLocation) {
      return res.status(400).json({ message: 'Please provide title, options, and target location' });
    }

    // Sanitize inputs
    title = title.trim();
    // Default to Official's location if targetLocation is empty, or use provided
    const finalLocation = targetLocation ? targetLocation.trim() : req.user.location;

    const sanitizedOptions = options
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    if (sanitizedOptions.length < 2) {
      return res.status(400).json({ message: 'Poll must have at least two valid options' });
    }

    const poll = await Poll.create({
      title,
      options: sanitizedOptions,
      targetLocation: finalLocation,
      createdBy: req.user.id
    });

    // ✅ Logging (Checklist Item 6)
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
    // Filter logic: Match exact location OR partial match (Regex)
    // This allows a user in "Hyderabad" to see polls for "Hyderabad"
    const locationFilter = req.user.location 
      ? { targetLocation: { $regex: req.user.location, $options: 'i' } }
      : {};

    const polls = await Poll.find(locationFilter)
      .populate('createdBy', 'name') // Nice to have: show who created it
      .sort({ createdAt: -1 });

    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single poll by ID (WITH RESULTS)
 * @route   GET /api/polls/:id
 * @access  Private
 */
exports.getPollById = async (req, res) => {
  try {
    const pollId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ message: 'Invalid poll ID' });
    }

    const poll = await Poll.findById(pollId).populate('createdBy', 'name');
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // 📊 AGGREGATION: Get stats immediately (Checklist Item 2.3 & 3.2)
    // This saves the frontend from making a second call
    const aggregation = await Vote.aggregate([
      { $match: { poll: new mongoose.Types.ObjectId(pollId) } },
      { $group: { _id: '$selectedOption', count: { $sum: 1 } } }
    ]);

    const totalVotes = aggregation.reduce((s, a) => s + a.count, 0);

    const results = poll.options.map(option => {
      const found = aggregation.find(a => a._id === option);
      const count = found ? found.count : 0;
      return {
        option,
        count,
        percentage: totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100)
      };
    });

    // Return combined data
    res.status(200).json({ 
      ...poll.toObject(), 
      totalVotes, 
      results 
    });

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

    // 🔒 SECURITY: Role Check (Checklist Item 4)
    if (req.user.role !== 'citizen') {
      return res.status(403).json({ message: 'Access denied. Only citizens can vote.' });
    }

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
    // Handle Duplicate Vote (MongoDB Error 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'You have already voted on this poll'
      });
    }
    res.status(500).json({ message: error.message });
  }
};