const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide a rating between 1-5']
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true
  },
  productivityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  teamworkScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  communicationScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  comments: {
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

module.exports = mongoose.model('Performance', performanceSchema);
