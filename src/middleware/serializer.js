const { path } = require('ramda');

const { stringify } = require('../utils/json');

const getValueFromCtx = path(['state', 'returnValue']);

module.exports = async (ctx, next) => {
  await next();
  const value = getValueFromCtx(ctx);
  if (value !== undefined) ctx.body = stringify(value);
};
