const fs = require('fs');
const path = require('path');

const SCALER_PATH = path.join(__dirname, '..', '..', 'model_artifacts', 'scaler_params.json');
const IMPUTER_PATH = path.join(__dirname, '..', '..', 'model_artifacts', 'imputer_stats.json');
const FEATURE_ORDER_PATH = path.join(__dirname, '..', '..', 'model_artifacts', 'feature_order.json');

let scalerCenter = null;
let scalerScale = null;
let imputerFillValues = null;
let featureOrder = null;
let solidsMax = null;

const RAW_PARAM_KEYS = [
  'ph', 'Hardness', 'Solids', 'Chloramines', 'Sulfate',
  'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity',
];

function loadPreprocessArtifacts() {
  const scaler = JSON.parse(fs.readFileSync(SCALER_PATH, 'utf8'));
  scalerCenter = scaler.center;
  scalerScale = scaler.scale;

  const imputer = JSON.parse(fs.readFileSync(IMPUTER_PATH, 'utf8'));
  imputerFillValues = imputer.fill_values;

  const featureOrderJson = JSON.parse(fs.readFileSync(FEATURE_ORDER_PATH, 'utf8'));
  featureOrder = featureOrderJson.features;
  solidsMax = featureOrderJson.solids_max;

  console.log(`Preprocess artifacts loaded: ${featureOrder.length} features, solids_max=${solidsMax}`);
}

function validateRawInput(input) {
  for (const key of RAW_PARAM_KEYS) {
    if (!(key in input)) {
      throw new Error(`Missing required parameter: ${key}`);
    }
  }
}

function normalizeValue(v) {
  if (v === null || v === undefined || v === '') return null;
  const num = Number(v);
  return Number.isNaN(num) ? null : num;
}

function engineerFeatures(raw) {
  const {
    ph, Hardness, Solids, Chloramines,
    Conductivity, Organic_carbon, Trihalomethanes, Turbidity,
  } = raw;

  const anyNull = (...vals) => vals.some((v) => v === null || v === undefined);

  const ph_deviation = anyNull(ph) ? null : Math.abs(ph - 7.0);
  const hard_cond_ratio = anyNull(Hardness, Conductivity)
    ? null
    : Hardness / (Conductivity + 1e-9);
  const chlor_oc_interact = anyNull(Chloramines, Organic_carbon)
    ? null
    : Chloramines * Organic_carbon;
  const halogen_burden = anyNull(Chloramines, Trihalomethanes)
    ? null
    : Chloramines + Trihalomethanes;
  const impurity_score = anyNull(Turbidity, Solids)
    ? null
    : (Turbidity * Solids) / (solidsMax + 1);
  const log_Solids = anyNull(Solids) ? null : Math.log1p(Solids);
  const log_Conductivity = anyNull(Conductivity) ? null : Math.log1p(Conductivity);

  return {
    ph_deviation,
    hard_cond_ratio,
    chlor_oc_interact,
    halogen_burden,
    impurity_score,
    log_Solids,
    log_Conductivity,
  };
}

function imputeValue(value, featureIndex) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return imputerFillValues[featureIndex];
  }
  return value;
}

function scaleValue(value, featureIndex) {
  return (value - scalerCenter[featureIndex]) / scalerScale[featureIndex];
}

function preprocessInput(rawInput) {
  if (!featureOrder) {
    throw new Error('Preprocess artifacts not loaded. Call loadPreprocessArtifacts() first.');
  }

  validateRawInput(rawInput);

  const raw = {};
  for (const key of RAW_PARAM_KEYS) {
    raw[key] = normalizeValue(rawInput[key]);
  }

  const engineered = engineerFeatures(raw);
  const fullRow = { ...raw, ...engineered };

  const imputedScaled = featureOrder.map((featureName, idx) => {
    const rawVal = fullRow[featureName];
    const imputed = imputeValue(rawVal, idx);
    return scaleValue(imputed, idx);
  });

  return imputedScaled;
}

module.exports = {
  loadPreprocessArtifacts,
  preprocessInput,
  engineerFeatures,
  RAW_PARAM_KEYS,
};