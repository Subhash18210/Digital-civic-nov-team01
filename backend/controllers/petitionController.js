const Petition = require('../models/Petition');
const Signature = require('../models/Signature'); 

// @desc    Create a new petition
// @route   POST /api/petitions
// @access  Private (Citizen)
exports.createPetition = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const newPetition = new Petition({
      title,
      description,
      category,
      location,
      creator: req.user.id
    });

    const savedPetition = await newPetition.save();
    res.status(201).json(savedPetition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all petitions (with filtering)
// @route   GET /api/petitions
// @access  Public (or restricted for Officials)
// RENAMED from 'getAllPetitions' to 'getPetitions' to match Route import
exports.getPetitions = async (req, res) => {
  try {
    const { category, status, location } = req.query;
    let query = {};

    // 1. Apply Filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (location) query.location = location;

    // 2. Official Logic (Only see their own location)
    if (req.user && req.user.role === 'official') {
      query.location = req.user.location;
    }

    const petitions = await Petition.find(query).sort({ createdAt: -1 });

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
    const petition = await Petition.findById(req.params.id).populate('creator', 'name email');

    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // Get signature count
    const signatureCount = await Signature.countDocuments({ petition: req.params.id });

    // Combine data
    const responseData = {
      ...petition.toObject(),
      signatureCount
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sign a petition
// @route   POST /api/petitions/:id/sign
// @access  Private (Citizen)
exports.signPetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const userId = req.user.id;

    const petition = await Petition.findById(petitionId);
    if (!petition) return res.status(404).json({ message: 'Petition not found' });

    // Check Status (Must be active)
    // NOTE: If testing manually, you must set petition status to 'active' in DB first
    if (petition.status !== 'active') {
       return res.status(400).json({ message: 'Cannot sign. Petition is not active.' });
    }

    // Check Duplicate
    const existingSignature = await Signature.findOne({ petition: petitionId, user: userId });
    if (existingSignature) {
      return res.status(400).json({ message: 'You have already signed this petition.' });
    }

    await Signature.create({ petition: petitionId, user: userId });
    res.status(201).json({ message: 'Petition signed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};