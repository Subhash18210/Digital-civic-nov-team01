const mongoose = require('mongoose');
const Petition = require('../models/Petition');
const AdminLog = require('../models/AdminLog');

/**
 * @desc    Get petitions for officials
 * @route   GET /api/governance/petitions
 * @access  Private (Official)
 */
exports.getPetitionsForOfficial = async (req, res) => {
  try {
    const filter = {
      location: req.user.location
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
    const { officialResponse, status } = req.body;

    if (!officialResponse) {
      return res.status(400).json({
        message: 'Response text is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(petitionId)) {
      return res.status(400).json({
        message: 'Invalid petition ID'
      });
    }

    const petition = await Petition.findById(petitionId);

    if (!petition) {
      return res.status(404).json({
        message: 'Petition not found'
      });
    }

    // 🔐 Validate location ownership
    if (petition.location !== req.user.location) {
      return res.status(403).json({
        message: 'You are not allowed to respond to this petition'
      });
    }

    // Save response
    petition.officialResponse = officialResponse;
    petition.respondedBy = req.user.id;
    petition.respondedAt = new Date();
    petition.status = status || 'closed';

    await petition.save();

    // 📝 Log admin action
    await AdminLog.create({
      action: 'Official responded to petition',
      user: req.user.id,
      petition: petition._id
    });

    res.status(200).json({
      message: 'Response saved successfully',
      petition
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
