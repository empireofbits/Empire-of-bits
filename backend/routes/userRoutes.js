const express = require('express');
const {
  getUser,
  createUser,
  updateUserPoints,
  getUserGames,
  getUserGame,
} = require('../controllers/userController');
const router = express.Router();

router.route('/:userId').get(getUser);
router.route('/').post(createUser);
router.route('/:userId/points').put(updateUserPoints);
router.route('/:userId/games').get(getUserGames);
router.route('/:userId/game').get(getUserGame);

module.exports = router;
