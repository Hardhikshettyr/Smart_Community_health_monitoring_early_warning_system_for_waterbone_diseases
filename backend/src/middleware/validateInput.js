const REQUIRED_PARAMS = [
  'ph', 'Hardness', 'Solids', 'Chloramines', 'Sulfate',
  'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity',
];

/**
 * Validates that a prediction request body contains all 9 required water
 * parameter keys. Values may be null/missing (imputation handles that),
 * but the keys themselves must be present so the request is unambiguous.
 */
function validatePredictionInput(req, res, next) {
  const missing = REQUIRED_PARAMS.filter((key) => !(key in req.body));

  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required parameters',
      missing,
    });
  }

  next();
}

module.exports = { validatePredictionInput, REQUIRED_PARAMS };
