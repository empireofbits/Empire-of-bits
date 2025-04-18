const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  points: {
    type: Number,
    default: 0
  },
  games: [{
    gameType: {
      type: String,
      enum: ['candycrush', 'battleship', 'spaceinvaders', 'platformer']
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'games.gameType'
    }
  }],
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

module.exports = mongoose.model('User', UserSchema);