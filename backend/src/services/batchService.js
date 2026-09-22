const fs = require('fs');
const csv = require('csv-parser');
const { predictProba } = require('./xgboostPredictor');
const { preprocessInput } = require('./preprocessService');
const { checkWhoViolations } = require('./whoViolationService');
const { evaluateDiseaseRisks, computeDiseaseSeverityScore } = require('../utils/diseaseRules');
const { assessRisk } = require('./riskScoreService');
const BatchUpload = require('../models/BatchUpload');

const REQUIRED_PARAMS = [
  'ph', 'Hardness', 'Solids', 'Chloramines', 'Sulfate',
  'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity',
];

/**
 * Reads a CSV file from disk and parses each row into a raw water-sample object.
 */
function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
  });
}

/**
 * Runs the core prediction pipeline (preprocess -> model -> WHO check ->
 * disease mapping -> risk score) on a single row, WITHOUT saving it
 * individually to the Prediction collection (batch results are aggregated
 * and stored as one BatchUpload document instead).
 */
function evaluateRow(rawRow, profileName) {
  const rawInput = {};
  for (const key of REQUIRED_PARAMS) {
    const val = rawRow[key];
    rawInput[key] = val === '' || val === undefined ? null : Number(val);
  }

  const preprocessedFeatures = preprocessInput(rawInput);
  const safeProbability = predictProba(preprocessedFeatures);

  const who = checkWhoViolations(rawInput, profileName);
  const diseases = evaluateDiseaseRisks(who.violationFlags);
  const diseaseSeverityScore = computeDiseaseSeverityScore(diseases);

  const { riskScore, verdict } = assessRisk({
    safeProbability,
    violations: who.violations,
    diseaseSeverityScore,
  });

  return { safeProbability, riskScore, verdict, violations: who.violations, diseases };
}

/**
 * Aggregates individual row results into a dataset-wide burden summary
 * (Feature #11): verdict distribution, average risk, most common violation
 * and most common disease across the whole uploaded batch.
 */
function buildSummary(rowResults) {
  const verdictCounts = { Safe: 0, Marginal: 0, Unsafe: 0, 'Critically Unsafe': 0 };
  const violationFrequency = {};
  const diseaseFrequency = {};
  let totalRisk = 0;
  let validCount = 0;

  for (const row of rowResults) {
    if (row.error) continue;

    verdictCounts[row.verdict] = (verdictCounts[row.verdict] || 0) + 1;
    totalRisk += row.riskScore;
    validCount += 1;

    for (const v of row.violationsList || []) {
      violationFrequency[v] = (violationFrequency[v] || 0) + 1;
    }
    for (const d of row.diseasesList || []) {
      diseaseFrequency[d] = (diseaseFrequency[d] || 0) + 1;
    }
  }

  const mostCommonViolation = Object.entries(violationFrequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  const mostCommonDisease = Object.entries(diseaseFrequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  return {
    verdictCounts,
    averageRiskScore: validCount > 0 ? Math.round((totalRisk / validCount) * 10) / 10 : 0,
    mostCommonViolation,
    mostCommonDisease,
    violationFrequency,
    diseaseFrequency,
  };
}

/**
 * Full batch-processing pipeline: parses the uploaded CSV, evaluates every
 * row through the prediction pipeline, aggregates a burden summary, and
 * saves the result to the database.
 *
 * @param {string} filePath - path to the uploaded CSV (from multer)
 * @param {string} fileName - original file name
 * @param {string} profileName - 'standard' or 'rural'
 * @param {string} userId
 */
async function processBatch({ filePath, fileName, profileName, userId }) {
  const rawRows = await parseCsvFile(filePath);

  const rowResults = rawRows.map((row, idx) => {
    try {
      const result = evaluateRow(row, profileName);
      return {
        rowIndex: idx,
        verdict: result.verdict,
        riskScore: result.riskScore,
        safeProbability: result.safeProbability,
        violationsList: result.violations.map((v) => v.parameter),
        diseasesList: result.diseases.map((d) => d.disease),
      };
    } catch (err) {
      return { rowIndex: idx, error: err.message };
    }
  });

  const summary = buildSummary(rowResults);

  const batch = await BatchUpload.create({
    userId,
    fileName,
    totalSamples: rawRows.length,
    profileUsed: profileName,
    summary,
    rowResults: rowResults.map(({ rowIndex, verdict, riskScore, safeProbability, error }) => ({
      rowIndex, verdict, riskScore, safeProbability, error,
    })),
  });

  // cleanup: remove the temp uploaded file after processing
  fs.unlink(filePath, () => {});

  return {
    batchId: batch._id,
    totalSamples: rawRows.length,
    summary,
    createdAt: batch.createdAt,
  };
}

module.exports = { processBatch };