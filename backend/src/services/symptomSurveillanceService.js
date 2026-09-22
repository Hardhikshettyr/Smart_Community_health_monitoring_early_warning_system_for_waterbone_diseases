const SymptomRecord = require('../models/SymptomRecord');
const Prediction = require('../models/Prediction');
const { classifyAberration } = require('../utils/statsUtils');

/**
 * Feature #15: Community Symptom Correlation Module.
 *
 * Inspired by Gawade et al.'s ASHA-worker syndromic surveillance system,
 * but extended with a genuinely novel capability none of the nine reviewed
 * papers implement: cross-referencing a symptom-based aberration alert with
 * this project's own ML-based water-quality verdict for the same location,
 * producing a combined confidence signal when both indicate risk.
 */

async function submitSymptomEntry({ reportedBy, location, week, diarrhea, fever, vomiting }) {
  const record = await SymptomRecord.create({
    reportedBy,
    location,
    week,
    diarrhea: diarrhea || 0,
    fever: fever || 0,
    vomiting: vomiting || 0,
  });

  return record;
}

async function getLocationStatus(location) {
  const records = await SymptomRecord.find({ location }).sort({ createdAt: 1 });

  if (records.length === 0) {
    throw new Error(`No symptom records found for location: ${location}`);
  }

  const latest = records[records.length - 1];
  const history = records.slice(0, -1);

  const currentTotal = latest.diarrhea + latest.fever + latest.vomiting;
  const historicalTotals = history.map((r) => r.diarrhea + r.fever + r.vomiting);

  const aberration = classifyAberration(currentTotal, historicalTotals);

  // Cross-reference with the most recent water-quality prediction tagged
  // with this same location.
  const latestWaterPrediction = await Prediction.findOne({ location })
    .sort({ createdAt: -1 });

  let combinedSignal = null;
  if (latestWaterPrediction) {
    const waterIsUnsafe = ['Unsafe', 'Critically Unsafe'].includes(latestWaterPrediction.verdict);
    const symptomsElevated = aberration.level === 'Amber' || aberration.level === 'Red';

    if (waterIsUnsafe && symptomsElevated) {
      combinedSignal = {
        alert: 'HIGH CONFIDENCE OUTBREAK SIGNAL',
        message: `Both water quality (${latestWaterPrediction.verdict}) and symptom reporting (${aberration.level}) indicate risk for this location.`,
      };
    }
  }

  return {
    location,
    latestEntry: {
      week: latest.week,
      diarrhea: latest.diarrhea,
      fever: latest.fever,
      vomiting: latest.vomiting,
      total: currentTotal,
    },
    historicalEntryCount: history.length,
    aberration,
    waterCrossReference: latestWaterPrediction
      ? { verdict: latestWaterPrediction.verdict, riskScore: latestWaterPrediction.riskScore }
      : null,
    combinedSignal,
  };
}

module.exports = { submitSymptomEntry, getLocationStatus };