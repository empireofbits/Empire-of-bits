const express = require('express');
const { 
  initializeGame, 
  recordGameResult, 
  getGameStats 
} = require('../controllers/battleshipController');
const router = express.Router();

router.route('/').post(initializeGame);
router.route('/:userId').get(getGameStats);
router.route('/:userId/result').post(recordGameResult);

module.exports = router;