const mongoose = require('mongoose');

const SpaceInvadersGameSchema = new mongoose.Schema({
  score: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  enemiesDestroyed: {
    type: Number,
    default: 0
  },
  playedAt: {
    type: Date,
    default: Date.now
  }
});

const SpaceInvadersSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  highScore: {
    type: Number,
    default: 0
  },
  totalGames: {
    type: Number,
    default: 0
  },
  gameHistory: [SpaceInvadersGameSchema],
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

module.exports = mongoose.model('spaceinvaders', SpaceInvadersSchema);
