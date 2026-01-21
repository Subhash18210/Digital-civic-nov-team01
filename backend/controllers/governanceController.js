const mongoose = require('mongoose');
const Petition = require('../models/Petition');
const AdminLog = require('../models/AdminLog');

/**
 * @desc    Get petitions for officials (Filtered by Jurisdiction)
 * @route   GET /api/governance/petitions
 * @access  Private (Official)
 */
exports.getPetitionsForOfficial = async (req, res) => {
  try {
    // 1. Filter by Official's Location
    // Using regex for safer case-insensitive matching
    const filter = {
      location: { $regex: req.user.location, $options: 'i' }
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const petitions = await Petition.find(filter)
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(petitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Official responds to a petition
 * @route   POST /api/governance/petitions/:id/respond
 * @access  Private (Official)
 */
exports.respondToPetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    // ✅ FIX 1: Match variable names sent from Frontend ({ response, status })
    const { response, status } = req.body;

    if (!response) {
      return res.status(400).json({ message: 'Response text is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(petitionId)) {
      return res.status(400).json({ message: 'Invalid petition ID' });
    }

    const petition = await Petition.findById(petitionId);

    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // 🔐 Validate location ownership (Optional: strict check)
    // Note: Using includes() handles cases like "North Delhi" vs "Delhi"
    if (!petition.location.toLowerCase().includes(req.user.location.toLowerCase())) {
      return res.status(403).json({
        message: 'You are not allowed to respond to petitions outside your jurisdiction'
      });
    }

    // ✅ FIX 2: Structure data to match Petition Schema nesting
    petition.officialResponse = {
      text: response,
      respondedBy: req.user._id,
      respondedAt: new Date()
    };

    // Update status if provided, else default logic
    if (status) {
        petition.status = status;
    }

    await petition.save();

    // ✅ FIX 3: Use correct Enum 'RESPONSE_SUBMITTED'
    await AdminLog.create({
      action: 'RESPONSE_SUBMITTED',
      user: req.user._id,
      petition: petition._id,
      details: `Official Response: "${response.substring(0, 20)}..."`
    });

    // Return populated data so frontend updates immediately
    const updatedPetition = await Petition.findById(petitionId)
        .populate('creator', 'name')
        .populate('officialResponse.respondedBy', 'name');

    res.status(200).json({
      message: 'Response saved successfully',
      petition: updatedPetition
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};