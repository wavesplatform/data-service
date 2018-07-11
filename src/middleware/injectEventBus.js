const { pick, curryN } = require('ramda');

const collectRequestData = ctx => ({
  ...pick(['headers', 'httpVersion', 'method', 'url'])(ctx.request),
  requestId: ctx.state.id,
  headers: Object.entries(ctx.request.headers)
    .map(h => h.join(':'))
    .join(';'),
});

module.exports = eventBus => async (ctx, next) => {
  // Add request info to all logs
  const request = collectRequestData(ctx);
  const emit = curryN(2, (message, data) =>
    eventBus.emit('log', { message, request, data }));
  ctx.eventBus = { emit };
  await next();
};
