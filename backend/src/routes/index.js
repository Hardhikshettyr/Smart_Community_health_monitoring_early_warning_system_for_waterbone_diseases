const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/predict/batch', require('./batchRoutes')); // must be registered before /predict
router.use('/predict', require('./predictRoutes'));
router.use('/history', require('./histroyRoutes'));
router.use('/report', require('./reportRoutes'));
router.use('/model', require('./modelInfoRoutes'));
router.use('/symptoms', require('./symptomRoutes'));

module.exports = router;