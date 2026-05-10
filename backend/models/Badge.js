const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide badge name']
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: null
  },
  requirement: {
    type: String,
    required: true
  },
  pointsRequired: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['achievement', 'milestone', 'special', 'performance'],
    default: 'achievement'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Badge', badgeSchema);
