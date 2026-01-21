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
    enum: ['Environment', 'Infrastructure', 'Education', 'Public safety', 'Health', 'Others'],
    index: true
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    index: true
  },
  
  // Petition Lifecycle Status
  status: {
    type: String,
    enum: ['active', 'under_review', 'closed'],
    default: 'active',
    index: true
  },

  // ✅ OFFICIAL RESPONSE FIELDS (Matches Checklist 1.1)
  officialResponse: {
    text: { 
      type: String 
    },
    respondedAt: { 
      type: Date 
    },
    respondedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Array of User IDs who signed
  upvotes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual Property: Calculate 'signatureCount' automatically
petitionSchema.virtual('signatureCount').get(function() {
  return this.upvotes ? this.upvotes.length : 0;
});

module.exports = mongoose.model('Petition', petitionSchema);
