const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Get token
      token = req.headers.authorization.split(' ')[1];
      
      // 2. Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(' Debug: Token Decoded ID:', decoded.id);

      // 3. Find User
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        console.log('Debug: User is NULL (User ID in token does not exist in DB)');
        return res.status(401).json({ message: 'User not found with this token' });
      }
      
      console.log(' Debug: User Found in DB:', req.user.email);
      next();
    } catch (error) {
      console.error('Debug: Protect Error:', error.message);
      // Added 'return' to stop execution here
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
     // Check if no token was found in the if-block
     return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // Debug what is being checked
    console.log(` Debug: Checking Role. User Role: ${req.user ? req.user.role : 'NONE'} | Allowed: ${roles}`);
    
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user ? req.user.role : 'unknown'} is not authorized` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };