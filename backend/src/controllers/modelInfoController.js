const { getModelInfo } = require('../services/modelInfoService');

function getInfo(req, res, next) {
  try {
    const meta = getModelInfo();
    res.status(200).json(meta);
  } catch (err) {
    next(err);
  }
}

module.exports = { getInfo };