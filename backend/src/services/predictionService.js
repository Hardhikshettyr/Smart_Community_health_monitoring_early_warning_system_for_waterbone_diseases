const { predictProba } = require('./xgboostPredictor');
const { preprocessInput } = require('./preprocessService');
const { checkWhoViolations } = require('./whoViolationService');
const { evaluateDiseaseRisks, computeDiseaseSeverityScore } = require('../utils/diseaseRules');
const { assessRisk } = require('./riskScoreService');
const { assessConfidence } = require('./confidenceService');
const { explainPrediction } = require('./explainabilityService');
const Prediction = require('../models/Prediction');

async function runPrediction({ rawInput, profileName = 'standard', userId, location = null }) {
  const preprocessedFeatures = preprocessInput(rawInput);
  const safeProbability = predictProba(preprocessedFeatures);

  const who = checkWhoViolations(rawInput, profileName);

  const diseases = evaluateDiseaseRisks(who.violationFlags);
  const diseaseSeverityScore = computeDiseaseSeverityScore(diseases);

  const { riskScore, verdict, recommendations } = assessRisk({
    safeProbability,
    violations: who.violations,
    diseaseSeverityScore,
  });

  const confidence = assessConfidence(safeProbability);

  const explanationFull = explainPrediction(preprocessedFeatures);
  const explanation = {
    topFeature: explanationFull.topFeature,
    ranked: explanationFull.ranked.slice(0, 5),
  };

  const prediction = await Prediction.create({
    userId,
    location,
    rawInput,
    profileUsed: who.profileUsed,
    safeProbability,
    riskScore,
    verdict,
    recommendations,
    violations: who.violations,
    diseases,
    confidence,
    explanation,
  });

  return {
    predictionId: prediction._id,
    safeProbability,
    riskScore,
    verdict,
    recommendations,
    violations: who.violations,
    diseases,
    confidence,
    explanation,
    profileUsed: who.profileUsed,
    createdAt: prediction.createdAt,
  };
}

module.exports = { runPrediction };