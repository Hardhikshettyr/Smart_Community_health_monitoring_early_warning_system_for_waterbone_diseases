const express = require('express');
const router = express.Router();
const { uploadBatch } = require('../controllers/batchController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// asha workers and admins can submit batch uploads
router.post(
  '/',
  authMiddleware,
  roleMiddleware('asha_worker', 'admin'),
  upload.single('file'),
  uploadBatch
);

module.exports = router;