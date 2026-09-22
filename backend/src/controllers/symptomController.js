const { submitSymptomEntry, getLocationStatus } = require('../services/symptomSurveillanceService');

async function createEntry(req, res, next) {
  try {
    const { location, week, diarrhea, fever, vomiting } = req.body;

    if (!location || !week) {
      return res.status(400).json({ error: 'location and week are required' });
    }

    const record = await submitSymptomEntry({
      reportedBy: req.user.id,
      location,
      week,
      diarrhea,
      fever,
      vomiting,
    });

    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}

async function getStatus(req, res, next) {
  try {
    const { location } = req.params;

    const status = await getLocationStatus(location);

    res.status(200).json(status);
  } catch (err) {
    next(err);
  }
}

module.exports = { createEntry, getStatus };