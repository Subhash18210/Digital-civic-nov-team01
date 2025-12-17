const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Ensures only logged-in users can see /me

router.post('/register', registerUser); // The Form calls this
router.post('/login', loginUser);       // The Login page calls this
router.get('/me', protect, getMe);      // The Dashboard calls this to remember you

module.exports = router;