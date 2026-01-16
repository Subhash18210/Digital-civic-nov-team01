const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the issue'],
      trim: true,
      maxlength: [50, 'Title cannot be more than 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    location: {
      type: String,
      required: [true, 'Please add the location of the issue']
      // In a real app, you might use GeoJSON coordinates here, 
      // but a string (e.g., "Main Street, Hyderabad") works for now.
    },
    image: {
      type: String, 
      default: 'no-photo.jpg' 
      // This will store the URL/Path of the uploaded photo
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('Report', reportSchema);