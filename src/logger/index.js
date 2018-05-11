const createLogger = require('./winston');

const createAndSubscribeLogger = ({ options, eventBus }) => {
  const logger = createLogger(options);

  const log = ({ message, request, data }) => {
    message === 'ERROR'
      ? logger.log({
        level: 'error',
        request,
        event: {
          name: message,
          meta: JSON.stringify({
            type: data.type,
            stack: data.error.stack,
            message: data.error.message,
          }),
        },
      })
      : logger.log({
        level: 'info',
        request,
        event: { name: message, meta: JSON.stringify(data) },
      });
  };

  eventBus.on('log', log);
};

module.exports = createAndSubscribeLogger;
