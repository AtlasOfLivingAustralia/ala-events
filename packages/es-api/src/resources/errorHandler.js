class ResponseError extends Error {
  constructor(statusCode, displayName, message) {
    super();
    this.statusCode = statusCode;
    this.displayName = displayName;
    this.message = message;
  }
}

function errorHandler(err, req, res, next) {
  // A second error after the response was sent (for example from a handler that
  // both called next(err) and threw) must not write again. Express 5's
  // res.status throws on a non-integer, which would replace the original error.
  if (res.headersSent) {
    next(err);
    return;
  }

  const parsedStatus = Number(err.statusCode);
  const statusCode = Number.isInteger(parsedStatus) && parsedStatus >= 100 && parsedStatus <= 999
    ? parsedStatus
    : 503;
  res.setHeader('Cache-Control', 'no-cache');
  res.status(statusCode).json({
    statusCode,
    message: err.message
  });

  next(err);
}

function unknownRouteHandler(req, res) {
  if (req.url == "/"){
    res.status(200).json({
      statusCode: 200,
      message: 'es-api alive'
    });
  } else {
    res.status(404).json({
      statusCode: 404,
      message: 'Not found'
    });
  }
}

function asyncMiddleware(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
}

module.exports = {
  ResponseError,
  errorHandler,
  asyncMiddleware,
  unknownRouteHandler
}