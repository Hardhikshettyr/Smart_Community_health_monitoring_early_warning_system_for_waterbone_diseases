const fs = require('fs');
const path = require('path');

const MODEL_PATH = path.join(__dirname, '..', '..', 'model_artifacts', 'xgb_model.json');
const FEATURE_ORDER_PATH = path.join(__dirname, '..', '..', 'model_artifacts', 'feature_order.json');

let trees = null;
let featureNames = null;

/**
 * Loads the model's trees and feature names for explanation purposes.
 * Independent of xgboostPredictor.js's own load, so this module is
 * self-contained. Must be called once at startup.
 */
function loadExplainabilityArtifacts() {
  const modelJson = JSON.parse(fs.readFileSync(MODEL_PATH, 'utf8'));
  trees = modelJson.learner.gradient_booster.model.trees;

  const featureOrderJson = JSON.parse(fs.readFileSync(FEATURE_ORDER_PATH, 'utf8'));
  featureNames = featureOrderJson.features;

  console.log(`Explainability artifacts loaded: ${trees.length} trees, ${featureNames.length} features`);
}

/**
 * Walks a single tree for one input row, attributing the change in the
 * node's expected output value at each split to the feature that caused
 * that split. This is the Saabas method - a well-established, simplified
 * per-prediction feature attribution technique for tree ensembles, and a
 * computationally light approximation of exact TreeSHAP.
 *
 * XGBoost's exported base_weights array stores the expected output value
 * for every node (both internal and leaf), which is exactly what this
 * method needs as its per-node reference value.
 */
function traverseWithContributions(tree, featureValues, contributions) {
  const { left_children, right_children, split_indices, split_conditions, base_weights, default_left } = tree;

  let nodeId = 0;

  while (left_children[nodeId] !== -1) {
    const featureIdx = split_indices[nodeId];
    const threshold = split_conditions[nodeId];
    const value = featureValues[featureIdx];

    let goLeft;
    if (value === null || value === undefined || Number.isNaN(value)) {
      goLeft = default_left[nodeId] === 1;
    } else {
      goLeft = value < threshold;
    }

    const parentValue = base_weights[nodeId];
    const childId = goLeft ? left_children[nodeId] : right_children[nodeId];
    const childValue = base_weights[childId];

    contributions[featureIdx] = (contributions[featureIdx] || 0) + (childValue - parentValue);

    nodeId = childId;
  }
}

/**
 * Computes per-feature contributions for a single prediction (Features #7, #8:
 * per-prediction feature importance and SHAP-style explainability).
 *
 * @param {number[]} preprocessedFeatures - the 16 imputed+scaled feature values,
 *   in the same order used to call predictProba()
 * @returns {object} { ranked: [{feature, contribution, absContribution}], topFeature: string }
 */
function explainPrediction(preprocessedFeatures) {
  if (!trees) {
    throw new Error('Explainability artifacts not loaded. Call loadExplainabilityArtifacts() first.');
  }

  const contributions = {};

  for (const tree of trees) {
    traverseWithContributions(tree, preprocessedFeatures, contributions);
  }

  const ranked = featureNames
    .map((name, idx) => ({
      feature: name,
      contribution: contributions[idx] || 0,
      absContribution: Math.abs(contributions[idx] || 0),
    }))
    .sort((a, b) => b.absContribution - a.absContribution);

  return {
    ranked,
    topFeature: ranked.length > 0 ? ranked[0].feature : null,
  };
}

module.exports = { loadExplainabilityArtifacts, explainPrediction };