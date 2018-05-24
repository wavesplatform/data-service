const createLogger = require('./winston');
const { stringifyMetaInProd } = require('./utils');

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
        level: 'info',
        request,
        event: { name: message, meta: stringifyMetaInProd(data) },
      });
  };

  eventBus.on('log', log);
};

module.exports = createAndSubscribeLogger;
