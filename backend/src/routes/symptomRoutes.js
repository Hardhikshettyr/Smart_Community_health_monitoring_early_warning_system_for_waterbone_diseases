const express = require('express');
const router = express.Router();
const { createEntry, getStatus } = require('../controllers/symptomController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('asha_worker', 'admin'), createEntry);
router.get('/:location/status', authMiddleware, getStatus);

module.exports = router;