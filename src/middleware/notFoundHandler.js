const { DEFAULT_NOT_FOUND_MESSAGE } = require('../errorHandling');

module.exports = async ctx => {
  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = {
      message: DEFAULT_NOT_FOUND_MESSAGE,
    };
  }
};
