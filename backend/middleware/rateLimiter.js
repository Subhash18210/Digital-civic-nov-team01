const rateLimit = require('express-rate-limit');

exports.voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 vote attempts
  message: {
    message: 'Too many vote attempts. Please try again later.'
  }
});
