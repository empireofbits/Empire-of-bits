const Platformer = require('../models/platformer');
const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorHandler');
const mongoose = require('mongoose');

// Initialize a new Platformer game for a user
const initializeGame = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      return next(new ErrorResponse(`User not found with id ${userId}`, 404));
    }
    
    // Check if game already exists for user
    let game = await Platformer.findOne({ userId });
    
    if (game) {
      return next(new ErrorResponse(`Platformer game already exists for user ${userId}`, 400));
    }
    
    // Initialize levels
    const levels = [];
    for (let i = 1; i <= 10; i++) {
      levels.push({
        levelNumber: i,
        completed: false,
        coinsCollected: 0,
        timeElapsed: 0,
        pointsEarned: 0
      });
    }
    
    // Create new game
    game = await Platformer.create({
      userId,
      levels
    });
    
    // Add game reference to user
    user.games.push({
      gameType: 'platformer',
      gameId: game._id
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      data: game
    });
  } catch (error) {
    next(error);
  }
};

// Update level progress
const updateLevelProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { levelNumber, completed, coinsCollected, timeElapsed } = req.body;
    
    // Find the game for the user
    const game = await Platformer.findOne({ userId });
    
    if (!game) {
      return next(new ErrorResponse(`Platformer game not found for user ${userId}`, 404));
    }
    
    // Find the level
    const level = game.levels.find(lvl => lvl.levelNumber === levelNumber);
    
    if (!level) {
      return next(new ErrorResponse(`Level ${levelNumber} not found`, 404));
    }
    
    // Calculate points based on completion, coins collected, and time
    let pointsEarned = 0;
    
    if (completed && !level.completed) {
      // Base points for completing the level
      pointsEarned = 100 * levelNumber;
      
      // Coins bonus
      if (coinsCollected) {
        pointsEarned += coinsCollected * 10;
      }
      
      // Time bonus (faster completion = more points)
      if (timeElapsed) {
        // Assuming an average completion time of 120 seconds
        const timeBonusFactor = Math.max(0, 120 - timeElapsed) / 120;
        pointsEarned += Math.round(pointsEarned * timeBonusFactor);
      }
      
      // Update level data
      level.completed = true;
      level.coinsCollected = coinsCollected || level.coinsCollected;
      level.timeElapsed = timeElapsed || level.timeElapsed;
      level.pointsEarned = pointsEarned;
      
      // Update game stats
      game.totalPoints += pointsEarned;
      game.totalCoinsCollected += (coinsCollected || 0);
      
      // If this is the current level and it's completed, increment current level
      if (game.currentLevel === levelNumber) {
        game.currentLevel += 1;
      }
      
      // Update user's total points
      const user = await User.findOne({ userId });
      if (user) {
        user.points += pointsEarned;
        await user.save();
      }
    }
    
    await game.save();
    
    res.status(200).json({
      success: true,
      data: game,
      pointsEarned
    });
  } catch (error) {
    next(error);
  }
};

// Get game progress
const getGameProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const game = await Platformer.findOne({ userId });
    
    if (!game) {
      return next(new ErrorResponse(`Platformer game not found for user ${userId}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initializeGame,
  updateLevelProgress,
  getGameProgress
};
