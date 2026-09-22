const PDFDocument = require('pdfkit');
const Prediction = require('../models/Prediction');
const Report = require('../models/Report');

/**
 * Fetches a prediction the requesting user is allowed to export:
 * either they own it, or they are an admin.
 */
async function getExportablePrediction(predictionId, requestingUser) {
  const prediction = await Prediction.findById(predictionId);

  if (!prediction) {
    throw new Error('Prediction not found');
  }

  const isOwner = prediction.userId.toString() === requestingUser.id;
  const isAdmin = requestingUser.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new Error('Not authorized to export this prediction');
  }

  return prediction;
}

/**
 * Builds a PDF report document from a prediction record and streams it
 * directly to the given response object.
 *
 * Feature #13: turns a completed prediction into a shareable, downloadable
 * report - supporting practical use by health authorities.
 */
function streamPredictionPdf(prediction, res) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="water-report-${prediction._id}.pdf"`
  );

  doc.pipe(res);

  // Title
  doc.fontSize(20).text('Water Quality Risk Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).fillColor('gray')
    .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.fillColor('black');
  doc.moveDown(2);

  // Verdict banner
  doc.fontSize(16).text(`Verdict: ${prediction.verdict}`, { underline: true });
  doc.fontSize(12).text(`Risk Score: ${prediction.riskScore} / 100`);
  doc.text(`Model Safe Probability: ${(prediction.safeProbability * 100).toFixed(2)}%`);
  doc.text(`Threshold Profile Used: ${prediction.profileUsed}`);
  doc.moveDown();

  // Confidence
  doc.fontSize(14).text('Confidence Assessment', { underline: true });
  doc.fontSize(11).text(`Level: ${prediction.confidence.confidenceLevel}`);
  doc.text(prediction.confidence.message);
  doc.moveDown();

  // Raw input parameters
  doc.fontSize(14).text('Submitted Water Parameters', { underline: true });
  doc.fontSize(11);
  for (const [key, value] of Object.entries(prediction.rawInput.toObject())) {
    doc.text(`${key}: ${value}`);
  }
  doc.moveDown();

  // WHO violations
  doc.fontSize(14).text('WHO Parameter Violations', { underline: true });
  doc.fontSize(11);
  if (prediction.violations.length === 0) {
    doc.text('No violations detected.');
  } else {
    for (const v of prediction.violations) {
      doc.text(`${v.parameter}: ${v.value} (${v.direction}, safe range ${v.min}-${v.max})`);
    }
  }
  doc.moveDown();

  // Disease risks
  doc.fontSize(14).text('Waterborne Disease Risk Mapping', { underline: true });
  doc.fontSize(11);
  if (prediction.diseases.length === 0) {
    doc.text('No specific disease risks flagged.');
  } else {
    for (const d of prediction.diseases) {
      doc.text(`[${d.severity}] ${d.disease} - ${d.reason}`);
    }
  }
  doc.moveDown();

  // Explanation
  doc.fontSize(14).text('Model Explanation (Top Contributing Features)', { underline: true });
  doc.fontSize(11);
  for (const f of prediction.explanation.ranked) {
    doc.text(`${f.feature}: contribution ${f.contribution.toFixed(4)}`);
  }
  doc.moveDown();

  // Recommendations
  doc.fontSize(14).text('Recommendations', { underline: true });
  doc.fontSize(11);
  for (const rec of prediction.recommendations) {
    doc.text(`- ${rec}`);
  }

  doc.end();
}

/**
 * Logs that a report export occurred (for audit/history purposes).
 */
async function logReportExport(predictionId, userId) {
  await Report.create({ predictionId, userId, format: 'pdf' });
}

module.exports = { getExportablePrediction, streamPredictionPdf, logReportExport };