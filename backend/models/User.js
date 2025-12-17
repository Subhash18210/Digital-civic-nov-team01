const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['citizen', 'official'], 
    default: 'citizen' 
  },
  location: { type: String, required: true }, // e.g., "San Diego, CA"
  isVerified: { type: Boolean, default: false }, // Checklist 4
}, { timestamps: true });

// Pre-save hook to hash password (Checklist 2)
// ✅ MODERN SYNTAX (No 'next' parameter needed)
userSchema.pre('save', async function() { 
  // 1. If password wasn't changed, do nothing
  if (!this.isModified('password')) return;

  // 2. Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // 3. We are done. (Async functions automatically return a promise, so Mongoose knows to continue)
});
// Method to compare password (Checklist 2)
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);