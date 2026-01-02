const express = require('express');
const router = express.Router();

// 1. Import Controller
const { 
  createPetition, 
  getPetitions, 
  getPetitionById, 
  signPetition 
} = require('../controllers/petitionController');

// 2. Import Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// 3. Define Routes
router.get('/', getPetitions);
router.get('/:id', getPetitionById);
router.post('/', protect, authorize('citizen'), createPetition);
router.post('/:id/sign', protect, authorize('citizen'), signPetition);

// 4. EXPORT ROUTER (Crucial Step!)
module.exports = router;