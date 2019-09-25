const { captureErrors } = require('../../../utils/captureErrors');
const { handleError } = require('../../../utils/handleError');
const { select } = require('../../utils/selectors');

const { pair: createPair } = require('../../../types');

/**
 * Endpoint
 * @name /matchers/:matcher/pairs/amountAsset/priceAsset?...params
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
    resolver: '/matchers/:matcher/pairs/:amountAsset/:priceAsset',
  });

  try {
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
      Just: ({ value }) => {
        ctx.state.returnValue = value;
      },
      Nothing: () => {
        ctx.state.returnValue = createPair(null, null);
      },
    });
  } catch (e) {
    e.matchWith({
      DB: () => {
        throw e;
      },
      Resolver: () => {
        throw e;
      },
      Validation: () => {
        ctx.status = 404;
      },
    });
  }
};
module.exports = service =>
  captureErrors(handleError)(pairsOneEndpoint(service));
