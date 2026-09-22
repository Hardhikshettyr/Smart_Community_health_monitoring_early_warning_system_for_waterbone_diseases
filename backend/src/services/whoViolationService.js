const { getProfile } = require('../config/whoRanges');

/**
 * Checks a single water sample's raw parameters against the selected
 * WHO/regional threshold profile.
 *
 * @param {object} rawInput - the 9 raw water parameters
 * @param {string} profileName - 'standard' or 'rural' (Feature #10)
 * @returns {object} {
 *   violations: [{ parameter, value, min, max, direction }],
 *   violationFlags: { ph_violated, Turbidity_violated, Chloramines_violated_low, ... },
 *   violationCount: number
 * }
 */
function checkWhoViolations(rawInput, profileName = 'standard') {
  const ranges = getProfile(profileName);
  const violations = [];
  const violationFlags = {};

  for (const [param, [min, max]] of Object.entries(ranges)) {
    const value = rawInput[param];

    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      violationFlags[`${param}_violated`] = false;
      continue;
    }

    const numValue = Number(value);
    const isLow = numValue < min;
    const isHigh = numValue > max;
    const isViolated = isLow || isHigh;

    violationFlags[`${param}_violated`] = isViolated;
    violationFlags[`${param}_violated_low`] = isLow;
    violationFlags[`${param}_violated_high`] = isHigh;

    if (isViolated) {
      violations.push({
        parameter: param,
        value: numValue,
        min,
        max,
        direction: isLow ? 'below minimum' : 'above maximum',
      });
    }
  }

  return {
    violations,
    violationFlags,
    violationCount: violations.length,
    profileUsed: profileName,
  };
}

module.exports = { checkWhoViolations };