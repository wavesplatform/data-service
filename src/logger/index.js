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

const createAndSubscribeLogger = ({ options, eventBus }) => {
  const logger = createLogger(options);

  const log = ({ message, request, data }) => {
    message === 'ERROR'
      ? logger.log({
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
      })
      : logger.log({
        level: getLevelOrDefault('debug')(data),
        request,
        event: { name: message, meta: stringifyMetaInProd(data) },
      });
  };

  eventBus.on('log', log);
};

module.exports = createAndSubscribeLogger;
