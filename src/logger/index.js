const createLogger = require('./winston');
const { stringifyMetaInProd } = require('./utils');
const {
  path,
  complement,
  isNil,
  cond,
  pathSatisfies,
  T,
  always,
  omit,
  propOr,
  compose,
} = require('ramda');

const isNotNil = complement(isNil);
const isPathNotNil = pathSatisfies(isNotNil);
const pathIfNotNil = p => [isPathNotNil(p), path(p)];
const getLevelOrDefault = def =>
  cond([
    pathIfNotNil(['level']),
    pathIfNotNil(['meta.level']),
    [T, always(def)],
  ]);

const createEvent = ({ message, request, data }) => {
  // safe get response time
  const responseTime = propOr(null, ['responseTime'], data);

  if (message === 'ERROR') {
    return {
      level: 'error',
      request,
      event: {
        name: message,
        meta: stringifyMetaInProd({
          type: data.type,
          stack: data.error.stack,
          message: data.error.message,
          ...data.meta,
        }),
      },
    };
  } else {
    return {
      level: getLevelOrDefault('debug')(data),
      request,
      event: {
        name: message,
        meta: stringifyMetaInProd(
          responseTime ? omit(['responseTime'], data) : data
        ),
        ...(responseTime ? { responseTime } : {}),
      },
    };
  }
};

const createAndSubscribeLogger = ({ options, eventBus }) => {
  const logger = createLogger(options);

  eventBus.on(
    'log',
    compose(
      x => logger.log(x),
      createEvent
    )
  );
};

module.exports = createAndSubscribeLogger;
