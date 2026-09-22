const {
  getExportablePrediction,
  streamPredictionPdf,
  logReportExport,
} = require('../services/reportService');

async function exportReport(req, res, next) {
  try {
    const { predictionId } = req.params;

    const prediction = await getExportablePrediction(predictionId, req.user);

    await logReportExport(predictionId, req.user.id);

    streamPredictionPdf(prediction, res);
  } catch (err) {
    next(err);
  }
}

module.exports = { exportReport };