const express = require('express');
const router = express.Router();

// 1. Import Controller
const { registerUser, loginUser, getMe } = require('../controllers/userController');

// 2. Import Middleware
const { protect } = require('../middleware/authMiddleware');

// 3. Define Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// 4. EXPORT ROUTER (Crucial Step!)
module.exports = router;
