const express = require('express');
const _ = require('lodash');
const cors = require('cors');
const config = require('./config');
var queue = require('express-queue');
const { loggingMiddleware, errorLoggingMiddleware } = require('./middleware');

const queueOptions = {
  activeLimit: 10,
  queuedLimit: 2000,
  rejectHandler: (req, res) => {
    res.status(429);
    res.json({ error: 429, message: 'Too many concurrent requests. This threshold is shared across users, so it is not only your requests.' });
  }
};
// express-queue creates a new limiter per call, so every ES route must share this instance.
const esQueue = queue(queueOptions);

let content, literature, occurrence, eventOccurrence, dataset, event;
if (config.content) {
  content = require('./resources/content');
}
if (config.content) {
  literature = require('./resources/literature');
}
if (config.eventOccurrence) {
  eventOccurrence = require('./resources/eventOccurrence');
}
if (config.occurrence) {
  occurrence = require('./resources/occurrence');
}
if (config.dataset) {
  dataset = require('./resources/dataset');
}
if (config.event) {
  event = require('./resources/event');
}
const { asyncMiddleware, ResponseError, errorHandler, unknownRouteHandler } = require('./resources/errorHandler');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

let setCache = function (req, res, next) {
  const period = 600; // unit seconds
  // if GET request, then add caching
  if (req.method == 'GET') {
    res.set('Cache-control', `public, max-age=${period}`)
  }
  // call next() to pass on the request
  next()
}
if (!config.debug) {
  // use cache middleware
  app.use(setCache)
}

// Add logging middleware
app.use(loggingMiddleware);

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Pass to next layer of middleware
  next();
});

const temporaryAuthMiddleware = function (req, res, next) {
  const apiKey = _.get(req, 'query.apiKey') || _.get(req, 'body.apiKey') || _.get(req, 'headers.Authorization', '').substr(10) || _.get(req, 'headers.authorization', '').substr(10);
  if (!apiKey) {
    return next(new ResponseError(401, 'temporaryAuthentication', 'You need to provide an apiKey in the url'));
  } else if (apiKey !== config.apiKey || !config.apiKey) {
    return next(new ResponseError(403, 'temporaryAuthentication', `Invalid apiKey: ${apiKey}`));
  }

  // req.query is a getter in Express 5 and is re-parsed on every access, so deleting
  // a property does not stick. Replace it with a copy that omits apiKey.
  const updatedQuery = { ...req.query };
  delete updatedQuery.apiKey;

  Object.defineProperty(req, 'query', {
    value: updatedQuery,
    writable: true,
    configurable: true,
    enumerable: true
  });

  // Pass to next layer of middleware
  next()
}
// use per route instead
// app.use(temporaryAuthMiddleware)

if (content) {
  app.post('/content/meta', asyncMiddleware(postMetaOnly(content)));
  app.get('/content/meta', asyncMiddleware(getMetaOnly(content)));

  app.post('/content', esQueue, asyncMiddleware(searchResource(content)));
  app.get('/content', esQueue, asyncMiddleware(searchResource(content)));
  app.get('/content/key/:id', esQueue, asyncMiddleware(keyResource(content)));
}

if (literature) {
  app.post('/literature/meta', asyncMiddleware(postMetaOnly(literature)));
  app.get('/literature/meta', asyncMiddleware(getMetaOnly(literature)));

  app.post('/literature', esQueue, asyncMiddleware(searchResource(literature)));
  app.get('/literature', esQueue, asyncMiddleware(searchResource(literature)));
  app.get('/literature/key/:id', esQueue, asyncMiddleware(keyResource(literature)));
}

if (occurrence) {
  app.post('/occurrence/meta', asyncMiddleware(postMetaOnly(occurrence)));
  app.get('/occurrence/meta', asyncMiddleware(getMetaOnly(occurrence)));

  app.post('/occurrence', esQueue, temporaryAuthMiddleware, asyncMiddleware(searchResource(occurrence)));
  app.get('/occurrence', esQueue, temporaryAuthMiddleware, asyncMiddleware(searchResource(occurrence)));
  app.get('/occurrence/key/:id', esQueue, asyncMiddleware(keyResource(occurrence)));

  app.get('/occurrence/suggest/:key', esQueue, temporaryAuthMiddleware, asyncMiddleware(suggestResource(occurrence)));
}

if (eventOccurrence) {
  app.post('/event-occurrence/meta', asyncMiddleware(postMetaOnly(eventOccurrence)));
  app.get('/event-occurrence/meta', asyncMiddleware(getMetaOnly(eventOccurrence)));

  app.post('/event-occurrence', esQueue, temporaryAuthMiddleware, asyncMiddleware(searchResource(eventOccurrence)));
  app.get('/event-occurrence', esQueue, temporaryAuthMiddleware, asyncMiddleware(searchResource(eventOccurrence)));
  app.get('/event-occurrence/key/:id', esQueue, asyncMiddleware(keyResource(eventOccurrence)));

  app.get('/event-occurrence/suggest/:key', esQueue, temporaryAuthMiddleware, asyncMiddleware(suggestResource(eventOccurrence)));
}

if (dataset) {
  app.post('/dataset', esQueue, temporaryAuthMiddleware, asyncMiddleware(searchResource(dataset)));
  app.get('/dataset', esQueue, temporaryAuthMiddleware, asyncMiddleware(searchResource(dataset)));
  app.get('/dataset/key/:id', esQueue, asyncMiddleware(keyResource(dataset)));
}

if (event) {
  app.post('/event/meta', asyncMiddleware(postMetaOnly(event)));
  app.get('/event/meta', asyncMiddleware(getMetaOnly(event)));

  app.post('/event', esQueue, temporaryAuthMiddleware, asyncMiddleware(searchResource(event)));
  app.get('/event', esQueue, temporaryAuthMiddleware, asyncMiddleware(searchResource(event)));
  app.get('/event/key/:qualifier/:id', esQueue, temporaryAuthMiddleware, asyncMiddleware(keyResource(event)));

  app.get('/event/suggest/taxonKey', esQueue, asyncMiddleware(async (req, res) => {
    const body = await event.scientificNameSuggest({ q: req.query.q, req });
    res.json(body);
  }));
}

function searchResource(resource) {
  const { dataSource, get2predicate, predicate2query, get2metric, metric2aggs } = resource;
  return async (req, res, next) => {
    try {
      // console.log(`queueLength: ${esQueue.queue.getLength()}`);

      const { metrics, predicate, size, from, randomSeed, randomize, includeMeta, sortBy, sortOrder } = parseQuery(req, { get2predicate, get2metric });
      const aggs = metric2aggs(metrics);
      const query = predicate2query(predicate);
      const { result, esBody } = await dataSource.query({ query, aggs, size, from, metrics, randomSeed, randomize, sortBy, sortOrder, req });

      res.json({
        ...result,
        ...(includeMeta && {
          meta: {
            GET: req.query,
            predicate,
            metrics,
            esBody
          }
        }),
      });
    } catch (err) {
      next(err);
    }
  }
}

function parseQuery(req, { get2predicate, get2metric }) {
  // get body from POST or GET
  let body = req.body || {};
  // if GET and body in url, then use that
  if (req.method === 'GET' && req.query.body) {
    try {
      body = JSON.parse(req.query.body);
    } catch (err) {
      throw new ResponseError(400, 'badRequest', `Malformed body`);
    }
  }

  // take anything but the body from the url query
  const { body: getBody, ...getQuery } = req.query;
  // then merge body (from POST or GET) with the url params giving preference to the body
  const query = { ...getQuery, ...body };

  const {
    predicate: jsonPredicate,
    metrics: jsonMetrics,
    size = 20,
    from = 0,
    randomSeed,
    randomize,
    includeMeta = false,
    sortBy,
    sortOrder,
    ...otherParams
  } = query;

  // get any metrics and predicate defined in v1 style. 
  let v1Predicate = get2predicate(otherParams);
  let v1Metrics = get2metric(otherParams);

  // merge get style and post style metrics request, giving priority to post style as that is more precise
  let metrics = Object.assign({}, v1Metrics, jsonMetrics)

  // AND queries: If user sends both post style and v1 style query, then join them with an "and" predicate
  let predicate;
  if (jsonPredicate && v1Predicate) {
    predicate = { type: 'and', predicates: [jsonPredicate, v1Predicate] }
  } else {
    // if both aren't set, then choose which ever is set
    predicate = v1Predicate ? v1Predicate : jsonPredicate;
  }

  const intSize = parseInt(size);
  const intFrom = parseInt(from);
  const intSeed = parseInt(randomSeed);
  const boolRandomize = (randomize + '').toLowerCase() === 'true';
  const result = { metrics, predicate, size: intSize, from: intFrom, randomSeed: intSeed, randomize: boolRandomize, includeMeta, sortBy, sortOrder };
  return result;
}

function keyResource(resource) {
  const { dataSource } = resource;
  return async (req, res) => {
    const body = await dataSource.byKey({ key: req.params.id, qualifier: req.params.qualifier, req });
    res.json(body);
  };
}

function suggestResource(resource) {
  const { dataSource, getSuggestQuery } = resource;
  return async (req, res, next) => {
    const suggestQuery = getSuggestQuery({ key: req.params.key, text: req.query.q });
    const body = await dataSource.suggest(suggestQuery);
    res.json(body);
  };
}

function postMetaOnly(resource) {
  const { predicate2query } = resource;
  return async (req, res) => {
    const predicate = req.body.predicate;
    const query = predicate2query(predicate);
    const meta = {
      predicate,
      query
    };

    res.json(meta);
  }
}

function getMetaOnly(resource) {
  const { get2predicate, predicate2query } = resource;
  return async (req, res, next) => {
    let predicate;
    let metrics;
    if (req.query.query) {
      try {
        const jsonQuery = JSON.parse(req.query.query);
        predicate = jsonQuery.predicate;
      } catch (err) {
        return next(new ResponseError(400, 'badRequest', `Invalid query: ${err.message}`));
      }
    } else {
      predicate = get2predicate(req.query);
    }
    const query = predicate2query(predicate);
    const meta = {
      predicate,
      query
    };

    res.json(meta);
  }
}

app.use(unknownRouteHandler);
app.use(errorHandler);
app.use(errorLoggingMiddleware);

// Express 5 invokes this callback with an error when listen fails, and that same
// callback is a one-shot 'error' listener. Keep a durable listener so a bind
// failure exits instead of logging success and leaving the process up.
const server = app.listen(config.port, (err) => {
  if (err) return;
  console.log(`🚀 Server ready at http://localhost:${config.port}`);
});
server.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
