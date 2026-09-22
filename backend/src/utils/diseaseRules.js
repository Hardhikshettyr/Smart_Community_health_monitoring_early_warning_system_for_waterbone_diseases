/**
 * Rule-based waterborne disease risk mapping.
 *
 * Each rule inspects which WHO parameters were flagged as violated and,
 * if its condition is met, contributes a candidate disease with a severity
 * level. This is NOT a machine-learned model - it is a fixed set of
 * clinically-motivated trigger conditions (11 rules covering cholera,
 * typhoid, dysentery, hepatitis A, protozoal infection, chemical
 * contamination, and disinfection-byproduct risk).
 *
 * severity: 'HIGH' | 'MEDIUM' | 'LOW' - used for ranking and for the
 * disease-severity term in the composite risk score.
 */

const DISEASE_RULES = [
  {
    id: 'cholera',
    disease: 'Cholera',
    severity: 'HIGH',
    condition: (v) => v.Turbidity_violated && v.Solids_violated,
    reason: 'High turbidity combined with elevated dissolved solids indicates conditions favorable to Vibrio cholerae survival.',
  },
  {
    id: 'typhoid',
    disease: 'Typhoid',
    severity: 'HIGH',
    condition: (v) => v.Turbidity_violated && v.Organic_carbon_violated,
    reason: 'High turbidity with elevated organic carbon suggests fecal contamination consistent with Salmonella typhi risk.',
  },
  {
    id: 'dysentery',
    disease: 'Dysentery',
    severity: 'HIGH',
    condition: (v) => v.Turbidity_violated && v.Chloramines_violated_low,
    reason: 'High turbidity with insufficient disinfectant (low chloramines) allows pathogenic bacteria associated with dysentery to persist.',
  },
  {
    id: 'hepatitis_a',
    disease: 'Hepatitis A',
    severity: 'HIGH',
    condition: (v) => v.Organic_carbon_violated && v.Trihalomethanes_violated_low && v.Chloramines_violated_low,
    reason: 'Elevated organic contamination with inadequate disinfection byproducts indicates insufficient viral inactivation.',
  },
  {
    id: 'protozoal_infection',
    disease: 'Protozoal Infection (e.g. Giardiasis)',
    severity: 'MEDIUM',
    condition: (v) => v.Turbidity_violated,
    reason: 'Elevated turbidity alone is a recognized indicator of protozoal cyst presence (e.g. Giardia, Cryptosporidium).',
  },
  {
    id: 'chemical_gi_irritation',
    disease: 'Chemical-Induced Gastrointestinal Irritation',
    severity: 'MEDIUM',
    condition: (v) => v.Sulfate_violated,
    reason: 'Elevated sulfate levels are associated with gastrointestinal irritation and diarrheal symptoms.',
  },
  {
    id: 'disinfection_byproduct_risk',
    disease: 'Disinfection Byproduct Exposure Risk',
    severity: 'MEDIUM',
    condition: (v) => v.Trihalomethanes_violated_high,
    reason: 'Elevated trihalomethanes indicate excess disinfection byproducts, linked to long-term chronic health risk.',
  },
  {
    id: 'chloramine_irritation',
    disease: 'Chemical Irritation (Chloramine Excess)',
    severity: 'LOW',
    condition: (v) => v.Chloramines_violated_high,
    reason: 'Excess chloramines can cause mild chemical irritation with prolonged exposure.',
  },
  {
    id: 'ph_corrosion_risk',
    disease: 'Chemical Contamination via Pipe Corrosion',
    severity: 'LOW',
    condition: (v) => v.ph_violated,
    reason: 'Out-of-range pH accelerates pipe corrosion, potentially leaching metals into drinking water.',
  },
  {
    id: 'dissolved_salts_risk',
    disease: 'Gastrointestinal Discomfort (Elevated Dissolved Salts)',
    severity: 'LOW',
    condition: (v) => v.Conductivity_violated,
    reason: 'High conductivity indicates elevated dissolved salts, associated with mild gastrointestinal discomfort.',
  },
  {
    id: 'hardness_risk',
    disease: 'Potential Kidney Stone Risk (Excess Hardness)',
    severity: 'LOW',
    condition: (v) => v.Hardness_violated,
    reason: 'Very high water hardness has been associated with increased risk of kidney stone formation over long-term consumption.',
  },
];

const SEVERITY_WEIGHT = { HIGH: 3, MEDIUM: 2, LOW: 1 };

/**
 * Evaluates all 11 disease rules against a violation-flags object
 * (as produced by whoViolationService) and returns the list of triggered
 * diseases, sorted by severity (HIGH first).
 */
function evaluateDiseaseRisks(violationFlags) {
  const triggered = DISEASE_RULES.filter((rule) => rule.condition(violationFlags));

  triggered.sort((a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]);

  return triggered.map(({ id, disease, severity, reason }) => ({
    id,
    disease,
    severity,
    reason,
  }));
}

/**
 * Computes a 0-1 disease severity score from the triggered diseases,
 * used as the Ds term in the composite risk score formula.
 */
function computeDiseaseSeverityScore(triggeredDiseases) {
  if (triggeredDiseases.length === 0) return 0;

  const maxWeight = Math.max(
    ...triggeredDiseases.map((d) => SEVERITY_WEIGHT[d.severity])
  );

  return maxWeight / 3; // normalize against HIGH=3
}

module.exports = { DISEASE_RULES, evaluateDiseaseRisks, computeDiseaseSeverityScore };