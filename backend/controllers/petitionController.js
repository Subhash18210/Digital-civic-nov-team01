const Petition = require('../models/Petition');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog'); // ✅ CHECKLIST 1.2: Import Logging

// @desc    Create a new petition
// @route   POST /api/petitions
// @access  Private (Citizen)
exports.createPetition = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const petition = await Petition.create({
      title,
      description,
      category,
      location,
      creator: req.user._id
    });

    res.status(201).json(petition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all petitions (with filtering)
// @route   GET /api/petitions
// @access  Public (Officials see filtered view)
exports.getPetitions = async (req, res) => {
  try {
    const { category, status, location } = req.query;
    let query = {};

    // 1. Apply Filters
    if (category) query.category = category;
    if (status) query.status = status;
    
    // Case-insensitive location search
    if (location) query.location = { $regex: location, $options: 'i' };

    // 2. Official Logic: If user is official, prioritizing their jurisdiction
    // (Optional: You can enforce this strictly or just use it as a default)
    if (req.user && req.user.role === 'official') {
       query.location = { $regex: req.user.location, $options: 'i' };
    }

    const petitions = await Petition.find(query)
      .populate('creator', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: petitions.length, petitions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single petition by ID
// @route   GET /api/petitions/:id
// @access  Public
exports.getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('officialResponse.respondedBy', 'name email'); // ✅ Show Official Name

    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    res.status(200).json(petition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sign a petition
// @route   POST /api/petitions/:id/sign
// @access  Private (Citizen)
exports.signPetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) return res.status(404).json({ message: 'Petition not found' });

    // Check Status (Must be active)
    if (petition.status !== 'active') {
       return res.status(400).json({ message: 'Cannot sign. Petition is not active.' });
    }

    // Check Duplicate (Using 'upvotes' array)
    if (petition.upvotes.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already signed this petition.' });
    }

    petition.upvotes.push(req.user._id);
    await petition.save();

    res.status(200).json({ 
        message: 'Petition signed successfully', 
        signatureCount: petition.upvotes.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------------------------------------------
// 🏛️ OFFICIAL / GOVERNANCE ACTIONS (Milestone 4)
// ------------------------------------------------------------------

// @desc    Update petition status (Official Only)
// @route   PUT /api/petitions/:id
// @access  Private (Official)
exports.updatePetitionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate Status
    if (!['active', 'under_review', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const petition = await Petition.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('creator', 'name email');

    if (!petition) return res.status(404).json({ message: 'Petition not found' });

    // ✅ LOG ACTION (Checklist 1.2)
    // Only attempts logging if AdminLog model is correctly imported
    try {
        await AdminLog.create({
            action: 'STATUS_UPDATE',
            user: req.user._id,
            petition: petition._id,
            details: `Status changed to: ${status}`
        });
    } catch (logError) {
        console.error("Failed to create AdminLog:", logError.message);
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

    // Validate input
    if (!response || !status) {
      return res.status(400).json({ message: 'Response and status are required' });
    }

    // Validate status enum
    if (!['active', 'under_review', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: 'Petition not found' });

    // ✅ FIX: Use correct field names matching Petition.js Schema
    petition.status = status;
    petition.officialResponse = {
      text: response,
      respondedAt: new Date(),       // Matches Schema
      respondedBy: req.user._id      // Matches Schema
    };

    await petition.save();

    // ✅ LOG ACTION (Checklist 1.2)
    try {
        await AdminLog.create({
            action: 'RESPONSE_SUBMITTED',
            user: req.user._id,
            petition: petition._id,
            details: `Response: "${response.substring(0, 20)}..."`
        });
    } catch (logError) {
        console.error("Failed to create AdminLog:", logError.message);
    }

    // Return populated data
    const updated = await Petition.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('officialResponse.respondedBy', 'name email');

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};