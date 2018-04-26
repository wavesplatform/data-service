const loggerSubscriptionMiddleware = logger => async (ctx, next) => {
  const eventBus = ctx.state.eventBus;
  const log = (msgType, ...args) => {
    switch (msgType) {
      case 'ERROR': {
        logger.log({
          level: 'error',
          requestId: ctx.state.id,
          options: {
            error: args[0],
          },
        });
        break;
      }
      default:
        logger.log({
          level: 'info',
          message: msgType,
          requestId: ctx.state.id,
          options: {
            args,
          },
        });
    }
  };

  eventBus.on('event', log);
  eventBus.emit('LOGGER_SUBSCRIBED');

  await next();
  eventBus.emit('LOGGER_UNSUBSCRIBED');
  eventBus.removeListener('event', log);
};

module.exports = loggerSubscriptionMiddleware;
