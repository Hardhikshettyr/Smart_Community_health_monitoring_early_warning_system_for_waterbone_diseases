const { getUserHistory, getAllHistory } = require('../services/historyService');

async function getMyHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 50;

    const history = await getUserHistory(userId, limit);

    res.status(200).json({ count: history.length, history });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;

    const history = await getAllHistory(limit);

    res.status(200).json({ count: history.length, history });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyHistory, getAll };