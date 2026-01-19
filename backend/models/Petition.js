const mongoose = require('mongoose');

const petitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },

  description: {
    type: String,
    required: [true, 'Please add a description']
  },

  category: {
    type: String,
    required: [true, 'Please add a category'],
    index: true
  },

  location: {
    type: String,
    required: [true, 'Please add a location'],
    index: true
  },

  // Petition lifecycle
  status: {
    type: String,
    enum: ['active', 'under_review', 'closed'],
    default: 'active'
  },

  // ✅ NEW: Official Response Field
  officialResponse: {
    text: String,
    date: Date,
    official: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Petition', petitionSchema);

// @desc    Update petition status (Official Only)
// @route   PATCH /api/petitions/:id
// @route   PUT /api/petitions/:id
// @access  Private (Official)
exports.updatePetitionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ FIXED: Check role properly
    if (!req.user || req.user.role !== 'official') {
      return res.status(403).json({ 
        message: 'Only officials can update petition status',
        userRole: req.user?.role 
      });
    }

    // Validate status
    if (!['active', 'under_review', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const petition = await Petition.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('creator', 'name email');

    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    res.status(200).json(petition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit official response to petition
// @route   POST /api/petitions/:id/response
// @access  Private (Official)
exports.submitResponse = async (req, res) => {
  try {
    const { response, status } = req.body;

    // ✅ FIXED: Check role properly
    if (!req.user || req.user.role !== 'official') {
      return res.status(403).json({ 
        message: 'Only officials can submit responses',
        userRole: req.user?.role 
      });
    }

    // Validate input
    if (!response || !status) {
      return res.status(400).json({ message: 'Response and status are required' });
    }

    // Validate status
    if (!['active', 'under_review', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const petition = await Petition.findByIdAndUpdate(
      req.params.id,
      {
        status,
        officialResponse: {
          text: response,
          date: new Date(),
          official: req.user.id
        }
      },
      { new: true }
    ).populate('creator', 'name email').populate('officialResponse.official', 'name email');

    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    res.status(200).json(petition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
