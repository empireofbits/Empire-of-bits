const mongoose = require('mongoose');

const PlatformerLevelSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  coinsCollected: {
    type: Number,
    default: 0
  },
  timeElapsed: {
    type: Number,  // in seconds
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  }
});

const PlatformerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  totalCoinsCollected: {
    type: Number,
    default: 0
  },
  levels: [PlatformerLevelSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('platformer', PlatformerSchema);
