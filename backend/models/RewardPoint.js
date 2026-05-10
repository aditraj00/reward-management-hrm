const mongoose = require('mongoose');

const rewardPointSchema = new mongoose.Schema({
  giver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    required: [true, 'Please provide reward points'],
    min: 1,
    max: 100
  },
  reason: {
    type: String,
    required: [true, 'Please provide reason for reward']
  },
  category: {
    type: String,
    enum: ['teamwork', 'innovation', 'quality', 'customer-service', 'leadership', 'other'],
    default: 'other'
  },
  bonus: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

module.exports = mongoose.model('RewardPoint', rewardPointSchema);
