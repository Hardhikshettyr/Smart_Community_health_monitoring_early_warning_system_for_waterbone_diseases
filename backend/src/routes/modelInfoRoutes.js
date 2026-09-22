const express = require('express');
const router = express.Router();
const { getInfo } = require('../controllers/modelInfoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getInfo);

module.exports = router;