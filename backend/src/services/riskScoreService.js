/**
 * Composite risk scoring, tiered verdict, and recommendations.
 * Implements the formula described in the project report:
 *
 *   RiskScore = w1 * Pu + w2 * Vp + w3 * Ds
 *
 * where:
 *   Pu = model's predicted probability that the sample is UNSAFE (0-1)
 *   Vp = WHO parameter violation penalty (0-1, violationCount / totalParams)
 *   Ds = disease-severity weighting from the rule-based mapping engine (0-1)
 *
 * The result is scaled to 0-100 and mapped to a four-tier verdict.
 */

const WEIGHTS = {
  w1: 0.5, // model probability weight
  w2: 0.3, // WHO violation penalty weight
  w3: 0.2, // disease severity weight
};

const TOTAL_PARAMS = 9;

const VERDICT_THRESHOLDS = [
  { max: 25, verdict: 'Safe', icon: 'safe' },
  { max: 50, verdict: 'Marginal', icon: 'marginal' },
  { max: 75, verdict: 'Unsafe', icon: 'unsafe' },
  { max: 100, verdict: 'Critically Unsafe', icon: 'critical' },
];

/**
 * Computes the composite 0-100 risk score.
 *
 * @param {number} safeProbability - model's P(safe), from predictProba()
 * @param {number} violationCount - number of WHO parameters violated
 * @param {number} diseaseSeverityScore - 0-1 score from computeDiseaseSeverityScore()
 * @returns {number} risk score from 0 to 100
 */
function computeRiskScore(safeProbability, violationCount, diseaseSeverityScore) {
  const Pu = 1 - safeProbability; // probability UNSAFE
  const Vp = Math.min(violationCount / TOTAL_PARAMS, 1);
  const Ds = diseaseSeverityScore;

  const rawScore = WEIGHTS.w1 * Pu + WEIGHTS.w2 * Vp + WEIGHTS.w3 * Ds;

  return Math.round(rawScore * 100 * 10) / 10; // one decimal place, 0-100 scale
}

/**
 * Maps a 0-100 risk score to a tiered verdict.
 */
function getVerdict(riskScore) {
  const tier = VERDICT_THRESHOLDS.find((t) => riskScore <= t.max);
  return tier ? tier.verdict : 'Critically Unsafe';
}

/**
 * Generates plain-language recommendations based on the verdict and
 * which specific parameters were violated.
 *
 * @param {string} verdict
 * @param {Array<{parameter, direction}>} violations
 * @returns {string[]}
 */
function generateRecommendations(verdict, violations) {
  const recs = [];

  if (verdict === 'Safe') {
    recs.push('Water meets safe consumption standards. No immediate action required.');
    recs.push('Continue routine periodic testing to maintain water safety.');
    return recs;
  }

  if (verdict === 'Marginal') {
    recs.push('Water quality is borderline. Retesting is recommended before regular consumption.');
  } else if (verdict === 'Unsafe') {
    recs.push('Water shows significant contamination. Boil water before consumption as a precaution.');
    recs.push('Avoid using this source for drinking until retested and confirmed safe.');
  } else if (verdict === 'Critically Unsafe') {
    recs.push('Do NOT consume this water under any circumstances.');
    recs.push('Report this water source to local health authorities immediately.');
    recs.push('Seek an alternative safe water source and consider emergency chlorination.');
  }

  // parameter-specific guidance
  for (const v of violations) {
    switch (v.parameter) {
      case 'Turbidity':
        recs.push('High turbidity detected - consider filtration or sedimentation before use.');
        break;
      case 'Chloramines':
        if (v.direction === 'below minimum') {
          recs.push('Low disinfectant level - water may be under-treated against pathogens.');
        } else {
          recs.push('Excess chloramines detected - may cause chemical irritation with prolonged use.');
        }
        break;
      case 'ph':
        recs.push('pH is out of the safe range - may indicate chemical contamination or corrosion risk.');
        break;
      case 'Trihalomethanes':
        recs.push('Elevated disinfection byproducts detected - review chlorination process.');
        break;
      case 'Sulfate':
        recs.push('High sulfate levels detected - may cause gastrointestinal discomfort.');
        break;
      default:
        break;
    }
  }

  return [...new Set(recs)]; // de-duplicate
}

/**
 * Runs the full risk-scoring step, combining model probability, WHO
 * violations, and disease severity into a single result object.
 */
function assessRisk({ safeProbability, violations, diseaseSeverityScore }) {
  const riskScore = computeRiskScore(safeProbability, violations.length, diseaseSeverityScore);
  const verdict = getVerdict(riskScore);
  const recommendations = generateRecommendations(verdict, violations);

  return { riskScore, verdict, recommendations };
}

module.exports = {
  computeRiskScore,
  getVerdict,
  generateRecommendations,
  assessRisk,
  WEIGHTS,
};