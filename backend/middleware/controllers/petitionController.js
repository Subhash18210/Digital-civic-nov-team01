const Petition = require('../models/Petition');
const Signature = require('../models/Signature');

// @desc    Get all petitions (with filters)
// @route   GET /api/petitions
// @access  Public
// Checklist 2.2 & 4 (Location filtering)
exports.getPetitions = async (req, res) => {
  try {
    const { category, location, status } = req.query;
    const queryObj = {};

    // Filter Logic
    if (category) queryObj.category = category;
    if (status) queryObj.status = status;

    // Special Logic: If Official, enforce location view (Checklist 4)
    // Note: This assumes you pass the user token even for this "Public" route if they are logged in
    if (req.user && req.user.role === 'official') {
        queryObj.location = req.user.location; 
    } else if (location) {
        // Normal user filtering
        queryObj.location = location;
    }

    const petitions = await Petition.find(queryObj).populate('creator', 'name');
    
    // Checklist 3.2: We need signature counts. 
    // Since virtuals populate is heavy, for a list we might do a simple count aggregation later,
    // but for now, let's just return the petitions.
    
    res.status(200).json(petitions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new petition
// @route   POST /api/petitions
// @access  Private (Citizen only)
// Checklist 2.1
exports.createPetition = async (req, res) => {
  try {
    const { title, description, category, location, signatureGoal } = req.body;

    const petition = await Petition.create({
      title,
      description,
      category,
      location,
      status: 'active', // Checklist: Default status
      creator: req.user.id // Checklist: Save creator ID
    });

    res.status(201).json(petition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Sign a petition
// @route   POST /api/petitions/:id/sign
// @access  Private (Citizen only)
// Checklist 3.1
exports.signPetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // Checklist: Check status = active
    if (petition.status !== 'active') {
        return res.status(400).json({ message: 'Cannot sign inactive petitions' });
    }

    // Checklist: Prevent duplicate signing (Try/Catch the unique index error)
    try {
        await Signature.create({
            petition: req.params.id,
            user: req.user.id
        });
        res.status(200).json({ message: 'Petition signed successfully' });
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({ message: 'You have already signed this petition' });
        }
        throw error;
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};