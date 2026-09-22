const fs = require('fs');
const path = require('path');

const MODEL_META_PATH = path.join(__dirname, '..', '..', 'model_artifacts', 'model_meta.json');

let cachedMeta = null;

function loadModelMeta() {
  const raw = fs.readFileSync(MODEL_META_PATH, 'utf8');
  cachedMeta = JSON.parse(raw);
  console.log('Model metadata loaded for transparency page');
}

function getModelInfo() {
  if (!cachedMeta) {
    throw new Error('Model metadata not loaded. Call loadModelMeta() first.');
  }
  return cachedMeta;
}

module.exports = { loadModelMeta, getModelInfo };