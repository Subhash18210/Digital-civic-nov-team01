const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
  petition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Petition',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: { createdAt: true, updatedAt: false } });

// Checklist: Compound unique index -> (petition + user)
// This prevents a user from signing the same petition twice at the database level
signatureSchema.index({ petition: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Signature', signatureSchema);