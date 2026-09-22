const fs = require('fs');
const path = require('path');

const MODEL_PATH = path.join(__dirname, '..', '..', 'model_artifacts', 'xgb_model.json');

let trees = null;
let baseScore = 0.5;
let numFeatures = 0;

/**
 * Loads the exported XGBoost model JSON once at startup and caches it in memory.
 * Must be called before predictProba() is used.
 */
function loadModel() {
  const raw = fs.readFileSync(MODEL_PATH, 'utf8');
  const modelJson = JSON.parse(raw);

  const learner = modelJson.learner;
  const gbModel = learner.gradient_booster.model;

  trees = gbModel.trees;
  numFeatures = parseInt(learner.learner_model_param.num_feature, 10);

  // base_score is stored as a string like "[5.7304E-1]" - parse the number out
  const baseScoreRaw = learner.learner_model_param.base_score;
  const match = baseScoreRaw.match(/[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?/);
  baseScore = match ? parseFloat(match[0]) : 0.5;

  console.log(`XGBoost model loaded: ${trees.length} trees, ${numFeatures} features, base_score=${baseScore}`);
}

/**
 * Walks a single tree (flat array representation) for one input row.
 * Returns the leaf value (raw margin contribution from this tree).
 */
function traverseTree(tree, featureValues) {
  const { left_children, right_children, split_indices, split_conditions, default_left } = tree;

  let nodeId = 0; // root

  while (left_children[nodeId] !== -1) {
    const featureIdx = split_indices[nodeId];
    const threshold = split_conditions[nodeId];
    const value = featureValues[featureIdx];

    let goLeft;
    if (value === null || value === undefined || Number.isNaN(value)) {
      // missing value - follow XGBoost's default direction for this node
      goLeft = default_left[nodeId] === 1;
    } else {
      goLeft = value < threshold;
    }

    nodeId = goLeft ? left_children[nodeId] : right_children[nodeId];
  }

  // leaf node - split_conditions holds the leaf output value here
  return tree.split_conditions[nodeId];
}

/**
 * Sigmoid function to convert raw margin score to a probability.
 */
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Predicts the probability of the positive class (Potability = 1, i.e. "safe")
 * for a single input row.
 *
 * @param {number[]} featureValues - array of 16 preprocessed (imputed + scaled) feature values,
 *                                   in the exact order defined by feature_order.json
 * @returns {number} probability between 0 and 1 that the sample is "safe" (class 1)
 */
function predictProba(featureValues) {
  if (!trees) {
    throw new Error('Model not loaded. Call loadModel() before predictProba().');
  }
  if (featureValues.length !== numFeatures) {
    throw new Error(
      `Expected ${numFeatures} features, got ${featureValues.length}`
    );
  }

  // sum leaf contributions across all trees
  let marginSum = 0;
  for (const tree of trees) {
    marginSum += traverseTree(tree, featureValues);
  }

  // XGBoost 2.x/3.x with boost_from_average=1 and binary:logistic:
  // base_score is stored already in probability space, so we convert it
  // to logit (margin) space first, add the tree margin sum, then apply sigmoid.
  const baseMargin = Math.log(baseScore / (1 - baseScore));
  const finalMargin = baseMargin + marginSum;

  return sigmoid(finalMargin);
}

module.exports = { loadModel, predictProba };