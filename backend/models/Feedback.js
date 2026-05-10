const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  givenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide feedback title']
  },
  content: {
    type: String,
    required: [true, 'Please provide feedback content']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  feedbackType: {
    type: String,
    enum: ['positive', 'constructive', 'suggestion'],
    default: 'constructive'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolution: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
