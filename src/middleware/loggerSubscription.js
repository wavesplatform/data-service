const { pick } = require('ramda');
const { performance } = require('perf_hooks');
const loggerSubscriptionMiddleware = logger => async (ctx, next) => {
  const startTime = performance.now();
  const eventBus = ctx.state.eventBus;
  const requestData = pick(
    ['headers', 'httpVersion', 'method', 'url'],
    ctx.request
  );
  const request = { ...requestData, requestId: ctx.state.id };
  const log = (msgType, e) => {
    logger.log({
      level: 'info',
      request,
      event: createEvent(msgType, e),
    });
  };
  const createEvent = (msgType, e) => ({
    name: msgType === 'ERROR' ? e.type : msgType,
    level: msgType === 'ERROR' ? 'error' : 'debug',
    meta:
      msgType === 'ERROR'
        ? { stack: e.error.stack, message: e.error.message }
        : e,
  });

  eventBus.on('event', log);
  eventBus.emit('REQUEST');

  await next();
  eventBus.emit('RESPONSE', {
    timeElapsed: performance.now() - startTime,
  });
  eventBus.removeListener('event', log);
};

module.exports = loggerSubscriptionMiddleware;
