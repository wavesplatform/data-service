const { identity } = require('ramda');

const { captureErrors } = require('../../utils/captureErrors');
const { handleError } = require('../../utils/handleError');
const { select } = require('../utils/selectors');
const { parseFilterValues, timeStart, timeEnd } = require('../_common/filters');
const { trimmedStringIfDefined } = require('../utils/parseString');
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
    matcher: trimmedStringIfDefined,
  })(query);

  // default
  if (!fValues.timeEnd) {
    fValues.timeEnd = new Date();
  }

  if (!fValues.matcher) {
    fValues.matcher = ctx.state.config.defaultMatcher;
  }

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

module.exports = captureErrors(handleError)(candlesSearch);
