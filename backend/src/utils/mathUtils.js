/**
 * General-purpose numeric helpers used across services.
 */

/**
 * Standard sigmoid function: maps any real number to (0, 1).
 */
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Clamps a value between a minimum and maximum bound.
 */
function clip(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Min-max normalizes a value into the 0-1 range given a known min/max.
 * Returns 0 if min === max to avoid division by zero.
 */
function normalize(value, min, max) {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

/**
 * Rounds a number to a given number of decimal places.
 */
function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

module.exports = { sigmoid, clip, normalize, roundTo };