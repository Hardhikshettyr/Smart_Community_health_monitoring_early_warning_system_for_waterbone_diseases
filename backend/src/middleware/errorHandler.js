const logger = require('../utils/logger');

/**
 * Centralized error-handling middleware. Must be registered last, after
 * all routes, so Express routes any thrown/next(err) errors here.
 */
function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack, path: req.originalUrl });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;