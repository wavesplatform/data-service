const { captureErrors } = require('../../../utils/captureErrors');
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
      amountAsset,
      priceAsset,
      matcher,
    })
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: pair,
  });

  pair.matchWith({
    Just: ({ value }) => (ctx.state.returnValue = value),
    Nothing: () => (ctx.status = 404),
  });
};

const handleError = ({ ctx, error }) => {
  ctx.eventBus.emit('ERROR', error);
  error.matchWith({
    Db: () => {
      ctx.status = 500;
      ctx.body = 'Database Error';
    },
    Resolver: () => {
      ctx.status = 500;
      ctx.body = 'Error resolving /pairs/:amountAsset/:priceAsset';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = service =>
  captureErrors(handleError)(pairsOneEndpoint(service));
