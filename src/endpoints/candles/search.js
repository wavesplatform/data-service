const { identity } = require('ramda');

const { captureErrors } = require('../../utils/captureErrors');
const { select } = require('../utils/selectors');
const { parseFilterValues, timeStart, timeEnd } = require('../_common/filters');
const service = require('../../services/candles');

const url = '/candles/:amountAsset/:priceAsset';

const candlesSearch = async ctx => {
  const candles = service({
    drivers: ctx.state.drivers,
    emitEvent: ctx.eventBus.emit,
  });

  const { fromParams } = select(ctx);
  const [amountAsset, priceAsset] = fromParams(['amountAsset', 'priceAsset']);

  const { query } = select(ctx);

  const fValues = parseFilterValues({
    timeStart,
    timeEnd,
    interval: identity,
  })(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: `${url}`,
    query,
  });

  let results = await candles
    .search({
      amountAsset,
      priceAsset,
      params: fValues,
    })
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: results,
  });

  if (results) {
    ctx.state.returnValue = results;
  } else {
    ctx.status = 404;
  }
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
      ctx.body = `Error resolving ${url}`;
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};

module.exports = captureErrors(handleError)(candlesSearch);
