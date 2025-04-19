const CandyCrush = require('../models/CandyCrush');  // Make sure this matches your filename exactly
const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorHandler');
const mongoose = require('mongoose');

// Initialize a new Candy Crush game for a user
const initializeGame = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      return next(new ErrorResponse(`User not found with id ${userId}`, 404));
    }
    
    // Check if game already exists for user
    let game = await CandyCrush.findOne({ userId });

    if (game) {
      // Return existing game data instead of error
      return res.status(200).json({
        success: true,
        data: game,
        message: 'Existing game found for user',
      });
    }

    // Initialize levels with increasing difficulty and points
    const levels = [];
    for (let i = 1; i <= 10; i++) {
      levels.push({
        levelNumber: i,
        cleared: false,
        stars: 0,
        pointsEarned: 0,
        maxPoints: i * 5000, // Points increase with level number
      });
    }

    // Create new game
    game = await CandyCrush.create({
      userId,
      levels,
    });

    // Add game reference to user
    user.games.push({
      gameType: 'candycrush',
      gameId: game._id,
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: game,
      message: 'New game created for user',
    });
  } catch (error) {
    next(error);
  }
};

// Update level progress
const updateLevelProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { levelNumber, cleared, stars } = req.body;

    // Find the game for the user
    const game = await CandyCrush.findOne({ userId });

    if (!game) {
      return next(
        new ErrorResponse(`Candy Crush game not found for user ${userId}`, 404),
      );
    }

    // Find the level
    const level = game.levels.find((lvl) => lvl.levelNumber === levelNumber);

    if (!level) {
      return next(new ErrorResponse(`Level ${levelNumber} not found`, 404));
    }

    // Update level data
    level.cleared = cleared || level.cleared;

    // Only update stars if the new value is higher
    if (stars && stars > level.stars) {
      level.stars = stars;
    }

    // Calculate points based on stars and level
    let pointsEarned = 0;
    if (cleared) {
      // Base points for clearing the level
      pointsEarned = level.maxPoints * 0.02;
      console.log('Base points for clearing:', pointsEarned);

      // Additional points based on stars
      // if (stars) {
      //   pointsEarned += (stars / 3) * level.maxPoints * 0.6;
      // }

      // Round points to integer
      pointsEarned = Math.round(pointsEarned);

      // Update level points
      level.pointsEarned = pointsEarned;

      // Update game total points
      game.totalPoints += pointsEarned;

      // If this is the current level and it's cleared, increment current level
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
      pointsEarned,
    });
  } catch (error) {
    next(error);
  }
};

// Get game progress
const getGameProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const game = await CandyCrush.findOne({ userId });

    if (!game) {
      return next(
        new ErrorResponse(`Candy Crush game not found for user ${userId}`, 404),
      );
    }

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initializeGame,
  updateLevelProgress,
  getGameProgress,
};