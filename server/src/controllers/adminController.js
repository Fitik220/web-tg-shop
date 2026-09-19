const statsService = require('../services/statsService');

async function getStats(req, res, next) {
  try {
    const stats = await statsService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

module.exports = { getStats };
