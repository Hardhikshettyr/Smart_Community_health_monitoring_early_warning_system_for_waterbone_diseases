const Prediction = require('../models/Prediction');

async function getUserHistory(userId, limit = 50) {
  const predictions = await Prediction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-__v');

  return predictions;
}

async function getAllHistory(limit = 100) {
  const predictions = await Prediction.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'email role')
    .select('-__v');

  return predictions;
}

module.exports = { getUserHistory, getAllHistory };