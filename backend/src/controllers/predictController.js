const { runPrediction } = require('../services/predictionService');
const { REQUIRED_PARAMS } = require('../middleware/validateInput');

async function predict(req, res, next) {
  try {
    const rawInput = {};
    for (const key of REQUIRED_PARAMS) {
      rawInput[key] = req.body[key];
    }

    const profileName = req.body.regionProfile || 'standard';
    const location = req.body.location || null;
    const userId = req.user.id;

    const result = await runPrediction({ rawInput, profileName, userId, location });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { predict };