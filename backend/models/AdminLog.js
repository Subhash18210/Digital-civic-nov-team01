const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['STATUS_UPDATE', 'RESPONSE_SUBMITTED', 'POLL_CREATED', 'REPORT_EXPORT']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Petition',
    required: false // Optional (logs might be for system reports)
  },
  // ✅ NEW: Stores details like "Changed status to Closed"
  details: {
    type: String 
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);