const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a poll title'],
      trim: true
    },

    options: {
      type: [String],
      required: [true, 'Please add poll options'],
      validate: {
        validator: function (options) {
          return options.length >= 2;
        },
        message: 'A poll must have at least two options'
      }
    },

    targetLocation: {
      type: String,
      required: [true, 'Please add a target location'], // e.g., Hyderabad
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Poll', pollSchema);
