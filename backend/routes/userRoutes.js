const express = require('express');
const router = express.Router();

// Ensure the path is exactly '../controllers/userController' (no extra quotes or spaces)
const { registerUser, loginUser, getMe } = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware'); 

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;