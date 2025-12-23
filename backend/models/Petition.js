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
    required: [true, 'Please add a category'], // e.g., Infrastructure, Health
    index: true
  },
  location: {
    type: String,
    required: [true, 'Please add a location'], // e.g., Hyderabad
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'under_review', 'closed'],
    default: 'under_review' 
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Petition', petitionSchema);