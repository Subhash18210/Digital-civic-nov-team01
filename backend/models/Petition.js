const mongoose = require('mongoose');

const petitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: true,
    enum: ['Environment', 'Infrastructure', 'Education', 'Public safety', 'Others']
  },
  location: {
    type: String,
    required: true,
    index: true // Checklist: Index on Location
  },
  status: {
    type: String,
    enum: ['active', 'under_review', 'closed'],
    default: 'active',
    index: true // Checklist: Index on Status
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true, // Checklist: createdAt, updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Checklist: Index on Category
petitionSchema.index({ category: 1 });

// Checklist 3.2: Virtual field for Signature Count
petitionSchema.virtual('signatures', {
  ref: 'Signature',
  localField: '_id',
  foreignField: 'petition',
  justOne: false,
  count: true // If you just want the number
});

module.exports = mongoose.model('Petition', petitionSchema);