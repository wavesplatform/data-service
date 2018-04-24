const captureErrors = errorHandler => middleware => (ctx, next) =>
  middleware(ctx, next).catch(
    error =>
      typeof error.matchWith === 'function'
        ? errorHandler({ ctx, error })
        : ctx.log({
          level: 'error',
          message: `Unhandled error: ${error.message}\n${error.stack}`,
        })
  );

module.exports = { captureErrors };
