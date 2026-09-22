/**
 * Statistical utilities for aberration detection (Feature #15), implementing
 * the same μ+2σ / μ+3σ threshold logic described by Gawade et al. for
 * syndromic surveillance early-warning systems.
 */

function mean(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function stdDev(values) {
  if (values.length === 0) return 0;
  const m = mean(values);
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Classifies a new case count against a location's historical baseline
 * using the μ+2σ (Amber) / μ+3σ (Red) aberration-detection thresholds.
 */
function classifyAberration(currentCount, historicalCounts) {
  if (historicalCounts.length < 3) {
    return {
      level: 'Insufficient Data',
      baselineMean: null,
      baselineStdDev: null,
      threshold2sigma: null,
      threshold3sigma: null,
      message: 'At least 3 historical entries are needed to establish a baseline.',
    };
  }

  const baselineMean = mean(historicalCounts);
  const baselineStdDev = stdDev(historicalCounts);

  const threshold2sigma = baselineMean + 2 * baselineStdDev;
  const threshold3sigma = baselineMean + 3 * baselineStdDev;

  let level;
  let message;

  if (currentCount > threshold3sigma) {
    level = 'Red';
    message = 'Case count significantly exceeds historical baseline (>3sigma). Possible outbreak.';
  } else if (currentCount > threshold2sigma) {
    level = 'Amber';
    message = 'Case count is elevated above historical baseline (>2sigma). Increased monitoring recommended.';
  } else {
    level = 'Green';
    message = 'Case count is within the normal historical range for this location.';
  }

  return {
    level,
    baselineMean: Math.round(baselineMean * 100) / 100,
    baselineStdDev: Math.round(baselineStdDev * 100) / 100,
    threshold2sigma: Math.round(threshold2sigma * 100) / 100,
    threshold3sigma: Math.round(threshold3sigma * 100) / 100,
    message,
  };
}

module.exports = { mean, stdDev, classifyAberration };