const express = require('express');
const router = express.Router();
const petitionController = require('../controllers/petitionController');
const { protect, authorize } = require('../middleware/authMiddleware'); // ✅ Import both

// Public routes
router.get('/', petitionController.getPetitions);
router.get('/:id', petitionController.getPetitionById);

// Protected routes (any authenticated user)
router.post('/', protect, petitionController.createPetition);
router.post('/:id/sign', protect, petitionController.signPetition);

// ✅ OFFICIAL ONLY routes - Add authorize middleware
router.patch('/:id', protect, authorize('official'), petitionController.updatePetitionStatus);
router.put('/:id', protect, authorize('official'), petitionController.updatePetitionStatus);
router.post('/:id/response', protect, authorize('official'), petitionController.submitResponse);

module.exports = router;

// @desc    Update petition status (Official Only)
// @route   PATCH /api/petitions/:id
// @route   PUT /api/petitions/:id
// @access  Private (Official)
exports.updatePetitionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ REMOVED: Role check (middleware handles it)
    
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

    // ✅ REMOVED: Role check (middleware handles it)

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
          official: req.user._id
        }
      },
      { new: true }
    ).populate('creator', 'name email')
     .populate('officialResponse.official', 'name email');

    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    res.status(200).json(petition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};