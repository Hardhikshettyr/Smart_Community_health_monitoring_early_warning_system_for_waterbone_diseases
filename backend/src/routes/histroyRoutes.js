const express = require('express');
const router = express.Router();
const { getMyHistory, getAll } = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, getMyHistory);
router.get('/all', authMiddleware, roleMiddleware('admin'), getAll);

module.exports = router;