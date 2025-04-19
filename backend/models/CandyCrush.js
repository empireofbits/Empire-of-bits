const mongoose = require('mongoose');

const CandyCrushLevelSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
    default: 1,
  },
  cleared: {
    type: Boolean,
    default: false,
  },
  stars: {
    type: Number,
    min: 0,
    max: 3,
    default: 0,
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
  maxPoints: {
    type: Number,
    required: true,
    default: 5000,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  bestScore: {
    type: Number,
    default: 0,
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
});

const CandyCrushSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    currentLevel: {
      type: Number,
      default: 1,
    },
    levels: [CandyCrushLevelSchema],
    lastPlayed: {
      type: Date,
      default: Date.now,
    },
    totalPlayTime: {
      type: Number,
      default: 0,
    },
    livesRemaining: {
      type: Number,
      default: 5,
      max: 5,
    },
    dailyBonus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Method to calculate total stars
CandyCrushSchema.methods.getTotalStars = function () {
  return this.levels.reduce((total, level) => total + level.stars, 0);
};

// Method to get progress percentage
CandyCrushSchema.methods.getProgressPercentage = function () {
  const clearedLevels = this.levels.filter((level) => level.cleared).length;
  return (clearedLevels / this.levels.length) * 100;
};

module.exports = mongoose.model('CandyCrush', CandyCrushSchema);
