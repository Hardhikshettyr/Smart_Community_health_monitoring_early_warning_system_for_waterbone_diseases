const { processBatch } = require('../services/batchService');

async function uploadBatch(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const profileName = req.body.regionProfile || 'standard';
    const userId = req.user.id;

    const result = await processBatch({
      filePath: req.file.path,
      fileName: req.file.originalname,
      profileName,
      userId,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadBatch };