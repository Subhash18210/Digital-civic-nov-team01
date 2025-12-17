const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: Generate a "Key" (Token) for the user
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (Store details)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create and Save the User (Password hashing is handled in the Model)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'citizen', // Default to citizen if not chosen [cite: 46]
      location // e.g., "San Diego, CA" [cite: 47]
    });

    // 3. Send back the "Key" (Token) and user info
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.log("❌ REGISTER ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login & Get Token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check password (using the method we added to the User model)
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user data (for Dashboard persistence)
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    // req.user comes from the authMiddleware
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};