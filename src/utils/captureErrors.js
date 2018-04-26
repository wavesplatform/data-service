const captureErrors = errorHandler => middleware => (ctx, next) =>
  middleware(ctx, next).catch(error => {
    if (typeof error.matchWith === 'function')
      return errorHandler({ ctx, error });
    ctx.status = error.status || 500;
    ctx.body = 'Something went wrong';
    ctx.state.eventBus.emit('ERROR', {
      error: error,
      meta: {},
      type: 'UnhandledError',
    });
  });

module.exports = { captureErrors };
