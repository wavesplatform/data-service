const { captureErrors } = require('../../../utils/captureErrors');
const { handleError } = require('../../../utils/handleError');
const { select } = require('../../utils/selectors');

/**
 * Endpoint
 * @name /matcher/:matcher/pairs/amountAsset/priceAsset?...params
 */
const pairsOneEndpoint = service => async ctx => {
  const { fromParams } = select(ctx);
  const [matcher, amountAsset, priceAsset] = fromParams([
    'matcher',
    'amountAsset',
    'priceAsset',
  ]);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: '/matcher/:matcher/pairs/:amountAsset/:priceAsset',
  });

  const pair = await service
    .get({
      pair: {
        amountAsset,
        priceAsset,
      },
      matcher,
    })
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: pair,
  });

  pair.matchWith({
    Just: ({ value }) => (ctx.state.returnValue = value),
    Nothing: () => {
      ctx.status = 404;
    },
  });
};
module.exports = service =>
  captureErrors(handleError)(pairsOneEndpoint(service));
