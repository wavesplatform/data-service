const { performance } = require('perf_hooks');

const accessLogMiddleware = async (ctx, next) => {
  const start = performance.now();
  ctx.eventBus.emit('REQUEST', { level: 'info' });

  await next();

  ctx.eventBus.emit('RESPONSE', {
    level: 'info',
    statusCode: ctx.status,
    responseTime: performance.now() - start,
  });
};

module.exports = accessLogMiddleware;
