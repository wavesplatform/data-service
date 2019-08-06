const { DEFAULT_NOT_FOUND_MESSAGE } = require('../errorHandling');

module.exports = async (ctx, next) => {
  await next();

  if (typeof ctx.state.returnValue === 'undefined') {
    ctx.status = 404;
    ctx.body = {
      message: DEFAULT_NOT_FOUND_MESSAGE,
    };
  }
};
