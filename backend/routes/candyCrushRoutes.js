const express = require('express');
const { 
  initializeGame, 
  updateLevelProgress, 
  getGameProgress 
} = require('../controllers/candyCrushController');
const router = express.Router();

router.route('/').post(initializeGame);
router.route('/:userId').get(getGameProgress);
router.route('/:userId/level').put(updateLevelProgress);

module.exports = router;