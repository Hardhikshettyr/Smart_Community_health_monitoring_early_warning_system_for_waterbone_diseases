const express = require('express');
const router = express.Router();
const { exportReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:predictionId/export', authMiddleware, exportReport);

module.exports = router;