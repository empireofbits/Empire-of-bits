const express = require('express');
const {
  initializeGame,
  recordGameSession,
  getGameStats,
} = require('../controllers/spaceInvadersController');
const router = express.Router();

router.route('/').post(initializeGame);
router.route('/:userId/session').post(recordGameSession);
router.route('/:userId').get(getGameStats);

module.exports = router;
