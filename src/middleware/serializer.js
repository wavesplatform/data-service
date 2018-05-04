const { path } = require('ramda');
const JSONBig = require('@waves/json-bigint');

const getValueFromCtx = path(['state', 'returnValue']);

module.exports = async (ctx, next) => {
  await next();
  const value = getValueFromCtx(ctx);
  if (value !== undefined) ctx.body = JSONBig.stringify(value);
};
