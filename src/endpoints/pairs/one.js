const { captureErrors } = require('../../utils/captureErrors');
const { handleError } = require('../../utils/handleError');
const { parseFilterValues } = require('../_common/filters');
const { query: parseQuery } = require('../_common/filters/parsers');
const { select } = require('../utils/selectors');

/**
 * Endpoint
 * @name /pairs/amountAsset/priceAsset?...params
 */
const pairsOneEndpoint = service => async ctx => {
  const { fromParams, query } = select(ctx);
  const [amountAsset, priceAsset] = fromParams(['amountAsset', 'priceAsset']);
  const { matcher } = parseFilterValues({ matcher: parseQuery })(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: '/pairs/:amountAsset/:priceAsset',
  });

  try {
    const pair = await service
      .get({
        pair: {
          amountAsset,
          priceAsset,
        },
        matcher: matcher || ctx.state.config.defaultMatcher,
      })
      .run()
      .promise();

    ctx.eventBus.emit('ENDPOINT_RESOLVED', {
      value: pair,
    });

    pair.matchWith({
      Just: ({ value }) => {
        if (value.data === null) {
          ctx.status = 404;
        } else {
          ctx.state.returnValue = value;
        }
      },
      Nothing: () => {
        ctx.status = 404;
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
