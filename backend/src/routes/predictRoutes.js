const express = require('express');
const router = express.Router();
const { predict } = require('../controllers/predictController');
const authMiddleware = require('../middleware/authMiddleware');
const { validatePredictionInput } = require('../middleware/validateInput');

router.post('/', authMiddleware, validatePredictionInput, predict);

module.exports = router;