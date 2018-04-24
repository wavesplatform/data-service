const captureErrors = errorHandler => middleware => (ctx, next) =>
  middleware(ctx, next).catch(error => errorHandler({ ctx, error }));

module.exports = { captureErrors };
