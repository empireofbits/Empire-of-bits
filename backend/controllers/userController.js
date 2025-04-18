const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorHandler');
const mongoose = require('mongoose');

// Get user by userId
const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${userId}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Create new user
const createUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      // User exists, just return the user data
      return res.status(200).json({
        success: true,
        data: existingUser,
        newUser: false,
      });
    }

    // Create new user with 50 initial points
    const user = await User.create({
      userId,
      points: 50, // Add 50 points to new user
    });

    // Return with newUser flag set to true
    res.status(201).json({
      success: true,
      data: user,
      newUser: true,
    });
  } catch (error) {
    next(error);
  }
};

// Update user points
const updateUserPoints = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { points, operation } = req.body;
    console.log('Operation:', operation);
    console.log('Points:', points);

    const user = await User.findOne({ userId });

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${userId}`, 404));
    }

    // Update points based on operation
    if (operation === 'add') {
      user.points += points;
    } else if (operation === 'deduct') {
      if (user.points < points) {
        return next(new ErrorResponse('Insufficient points to deduct', 400));
      }
      user.points -= points;
    } else {
      return next(
        new ErrorResponse('Invalid operation. Use "add" or "deduct"', 400),
      );
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's game details
const getUserGame = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId }).populate({
      path: 'games.gameId',
      model: req.query.gameType || 'candycrush',
    });

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${userId}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user.games,
    });
  } catch (error) {
    next(error);
  }
};

const getUserGames = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find the user first
    const user = await User.findOne({ userId });

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${userId}`, 404));
    }

    // Initialize empty result object to store all game data
    const allGames = {
      candycrush: null,
      battleship: null,
      spaceinvaders: null,
      platformer: null,
    };

    // Use Promise.all to fetch only the games the user has played
    await Promise.all(
      user.games.map(async (gameEntry) => {
        const gameModel = mongoose.model(gameEntry.gameType);
        const gameData = await gameModel.findById(gameEntry.gameId);
        if (gameData) {
          allGames[gameEntry.gameType] = gameData;
        }
      }),
    );

    res.status(200).json({
      success: true,
      userId: { userId: user.userId, points: user.points },
      games: allGames,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  createUser,
  updateUserPoints,
  getUserGame,
  getUserGames,
};
