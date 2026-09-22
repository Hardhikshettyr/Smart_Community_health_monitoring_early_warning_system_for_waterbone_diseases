/**
 * Confidence-based borderline flagging (Feature #9).
 *
 * If the model's predicted probability is close to the 0.5 decision boundary,
 * the prediction is genuinely uncertain and should not be presented with the
 * same confidence as a clear-cut Safe or Unsafe result. This directly
 * addresses the complete absence of confidence/uncertainty reporting across
 * all nine reviewed papers.
 */

const BORDERLINE_LOWER = 0.4;
const BORDERLINE_UPPER = 0.6;

/**
 * Classifies a prediction's confidence level based on how far its
 * safe-probability sits from the 0.5 decision boundary.
 *
 * @param {number} safeProbability - model's P(safe), between 0 and 1
 * @returns {object} { confidenceLevel, isBorderline, distanceFromBoundary, message }
 */
function assessConfidence(safeProbability) {
  const isBorderline = safeProbability >= BORDERLINE_LOWER && safeProbability <= BORDERLINE_UPPER;
  const distanceFromBoundary = Math.abs(safeProbability - 0.5);

  let confidenceLevel;
  let message;

  if (isBorderline) {
    confidenceLevel = 'Borderline';
    message = 'This prediction is close to the decision boundary. Retesting is recommended before relying on this result.';
  } else if (distanceFromBoundary >= 0.35) {
    confidenceLevel = 'High';
    message = 'The model is highly confident in this prediction.';
  } else {
    confidenceLevel = 'Medium';
    message = 'The model is reasonably confident in this prediction.';
  }

  return {
    confidenceLevel,
    isBorderline,
    distanceFromBoundary: Math.round(distanceFromBoundary * 1000) / 1000,
    message,
  };
}

module.exports = { assessConfidence, BORDERLINE_LOWER, BORDERLINE_UPPER };