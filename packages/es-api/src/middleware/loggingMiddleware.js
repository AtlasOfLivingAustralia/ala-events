const config = require('../config');
const logger = require('../logger');

function loggingMiddleware(req, res, next) {
  const startTime = process.hrtime();

  // Keep track of wether the request has been logged as an error
  req.loggedAsError = false;

  res.on('finish', () => {
    // Don't log if the request has been logged as an error
    if (req.loggedAsError) return;

    const executionTime = process.hrtime(startTime);
    const elapsedMilliseconds = (executionTime[0] * 1e9 + executionTime[1]) / 1e6;
    const duration = Math.round(elapsedMilliseconds);

    if (config.debug) {
      const date = new Date();
      logger.info({
        message: 'ES-API Request',
        time: date.toISOString(),
        timeInCopenhagen: date.toLocaleString('en-GB', { timeZone: 'Europe/Copenhagen' }),
        executionTimeMs: duration,
        request: {
          headers: req.headers,
          body: req.body,
          method: req.method,
          url: req.url,
        },
        response: {
          statusCode: res.statusCode,
          headers: res.headers,
          body: res.body,
        }
      });
      return;
    }

    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
    });
  });

  next();
}

module.exports = loggingMiddleware;