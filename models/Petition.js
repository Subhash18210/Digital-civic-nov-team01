const mongoose = require('mongoose');

const petitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },

  description: {
    type: String,
    required: [true, 'Please add a description']
  },

  category: {
    type: String,
    required: [true, 'Please add a category'],
    index: true
  },

  location: {
    type: String,
    required: [true, 'Please add a location'],
    index: true
  },

  // Petition lifecycle
  status: {
    type: String,
    enum: ['active', 'under_review', 'closed'],
    default: 'under_review'
  },

  // 👇 NEW FIELDS (Milestone 4)
  officialResponse: {
    type: String
  },

  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  respondedAt: {
    type: Date
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Petition', petitionSchema);
