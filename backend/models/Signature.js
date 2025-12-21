const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
  petition: {
    type: mongoose.Schema.ObjectId,
    ref: 'Petition',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Checklist: Compound unique index -> (petition + user)
// This strictly prevents a user from signing the same petition twice at the DB level
signatureSchema.index({ petition: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Signature', signatureSchema);