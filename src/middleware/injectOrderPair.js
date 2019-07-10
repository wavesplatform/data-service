const { createOrderPair } = require('@waves/assets-pairs-order');

module.exports = settings => async (ctx, next) => {
  const orderPair = createOrderPair(settings);
  ctx.orderPair = orderPair;

  await next();
};
