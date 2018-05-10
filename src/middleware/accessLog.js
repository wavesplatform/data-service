const { performance } = require('perf_hooks');

const accessLogMiddleware = async (ctx, next) => {
  const start = performance.now();
  ctx.eventBus.emit('REQUEST');

  await next();

  ctx.eventBus.emit('RESPONSE', {
    statusCode: ctx.status,
    responseTime: performance.now() - start,
  });
};

module.exports = accessLogMiddleware;
