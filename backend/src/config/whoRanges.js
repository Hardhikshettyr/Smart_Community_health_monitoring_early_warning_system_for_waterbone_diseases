/**
 * WHO/EPA safe limits for the 9 physicochemical water parameters.
 *
 * Two profiles are provided:
 *  - STANDARD: strict WHO/EPA safe limits (default, suitable for urban/general use)
 *  - RURAL:    a relaxed baseline for resource-constrained rural contexts, where
 *              the strict WHO cutoffs may not be locally achievable, but water
 *              is still broadly usable. This directly implements Feature #10
 *              (region-adjustable threshold profiles), addressing the
 *              one-size-fits-all limitation identified across the reviewed
 *              literature (Inam, 2025).
 *
 * Each entry is [min, max]. A value outside this range counts as a violation.
 */

const STANDARD_PROFILE = {
  ph: [6.5, 8.5],
  Hardness: [0, 300],
  Solids: [0, 500],
  Chloramines: [0, 4.0],
  Sulfate: [0, 250],
  Conductivity: [0, 800],
  Organic_carbon: [0, 5.0],
  Trihalomethanes: [0, 100],
  Turbidity: [0, 5.0],
};

const RURAL_PROFILE = {
  ph: [6.0, 9.0],
  Hardness: [0, 400],
  Solids: [0, 700],
  Chloramines: [0, 5.0],
  Sulfate: [0, 350],
  Conductivity: [0, 1000],
  Organic_carbon: [0, 7.0],
  Trihalomethanes: [0, 130],
  Turbidity: [0, 8.0],
};

const PROFILES = {
  standard: STANDARD_PROFILE,
  rural: RURAL_PROFILE,
};

/**
 * Returns the threshold profile for the given profile name.
 * Defaults to 'standard' if an unknown/missing name is passed.
 *
 * @param {string} profileName - 'standard' or 'rural'
 * @returns {object} map of parameter -> [min, max]
 */
function getProfile(profileName) {
  return PROFILES[profileName] || PROFILES.standard;
}

module.exports = { STANDARD_PROFILE, RURAL_PROFILE, getProfile };