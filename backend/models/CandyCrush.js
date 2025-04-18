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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('candycrush', CandyCrushSchema);
