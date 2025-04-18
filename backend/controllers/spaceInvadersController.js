const SpaceInvaders = require('../models/SpaceInvaders');
const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorHandler');
const mongoose = require('mongoose');

// Initialize a new Space Invaders game for a user
const initializeGame = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      return next(new ErrorResponse(`User not found with id ${userId}`, 404));
    }

    // Check if game already exists for user
    let game = await SpaceInvaders.findOne({ userId });

    if (!game) {
      // Create new game
      game = await SpaceInvaders.create({ userId });

      // Add game reference to user
      user.games.push({
        gameType: 'spaceinvaders',
        gameId: game._id,
      });

      await user.save();
    }

    res.status(201).json({
      success: true,
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

// Record game session
const recordGameSession = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { score, level } = req.body;

    // Find the game for the user
    const game = await SpaceInvaders.findOne({ userId });

    if (!game) {
      return next(
        new ErrorResponse(
          `Space Invaders game not found for user ${userId}`,
          404,
        ),
      );
    }

    // Calculate points - in this case, score directly translates to points
    const pointsEarned = score || 0;

    // Add game session to history
    game.gameHistory.push({
      score: score || 0,
      level: level || 1,
      enemiesDestroyed: 0,
      playedAt: Date.now(),
    });

    // Update game stats
    game.totalGames += 1;
    game.totalPoints += pointsEarned;

    // Update high score if applicable
    if (score > game.highScore) {
      game.highScore = score;
    }

    // Update user's total points
    const user = await User.findOne({ userId });
    if (user) {
      user.points += pointsEarned;
      await user.save();
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

// Get game statistics
const getGameStats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const game = await SpaceInvaders.findOne({ userId });

    if (!game) {
      return next(
        new ErrorResponse(
          `Space Invaders game not found for user ${userId}`,
          404,
        ),
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
  recordGameSession,
  getGameStats,
};
