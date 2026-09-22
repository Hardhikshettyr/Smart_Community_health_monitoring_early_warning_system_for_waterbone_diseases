const { evaluateDiseaseRisks, computeDiseaseSeverityScore } = require('../utils/diseaseRules');

/**
 * Thin service-layer wrapper around the disease-rule utilities, so
 * prediction/batch services depend on a service (business logic layer)
 * rather than reaching directly into utils. Combines rule evaluation and
 * severity scoring into a single call.
 *
 * @param {object} violationFlags - from whoViolationService.checkWhoViolations()
 * @returns {object} { diseases, diseaseSeverityScore }
 */
function mapViolationsToDiseases(violationFlags) {
  const diseases = evaluateDiseaseRisks(violationFlags);
  const diseaseSeverityScore = computeDiseaseSeverityScore(diseases);

  return { diseases, diseaseSeverityScore };
}

module.exports = { mapViolationsToDiseases };