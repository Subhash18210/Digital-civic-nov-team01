const express = require('express');
const router = express.Router();
const petitionController = require('../controllers/petitionController');
const { protect, authorize } = require('../middleware/authMiddleware'); 

// ---------------------------------------------------------
// PUBLIC ROUTES
// ---------------------------------------------------------
// Get all petitions (Officials see filtered view based on jurisdiction)
router.get('/', petitionController.getPetitions);

// Get single petition details
router.get('/:id', petitionController.getPetitionById);


// ---------------------------------------------------------
// PROTECTED ROUTES (Logged in Citizens & Officials)
// ---------------------------------------------------------
// Create a new petition
router.post('/', protect, petitionController.createPetition);

// Sign a petition
router.post('/:id/sign', protect, petitionController.signPetition);


// ---------------------------------------------------------
// OFFICIAL ONLY ROUTES (Governance)
// ---------------------------------------------------------
// Update petition status (Active -> Under Review -> Closed)
router.patch('/:id', protect, authorize('official'), petitionController.updatePetitionStatus);
router.put('/:id', protect, authorize('official'), petitionController.updatePetitionStatus);

// Submit an official response to a petition
router.post('/:id/response', protect, authorize('official'), petitionController.submitResponse);

module.exports = router;