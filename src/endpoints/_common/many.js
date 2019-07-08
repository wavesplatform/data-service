const { has } = require('ramda');

const { captureErrors } = require('../../utils/captureErrors');
const { handleError } = require('../../utils/handleError');
const { select } = require('../utils/selectors');

const { parseFilterValues } = require('./filters');

const createManyMiddleware = (
  { parseFiltersFn, filterParsers, mgetFilterName },
  url,
  service
) => {
  return captureErrors(handleError)(async ctx => {
    const s = service({
      drivers: ctx.state.drivers,
      emitEvent: ctx.eventBus.emit,
    });

    if (!s.mget && !s.search) {
      ctx.status = 404;
      return;
    }

    const { query } = select(ctx);
    const fValues = parseFiltersFn
      ? parseFiltersFn(query)
      : parseFilterValues(filterParsers)(query);

    ctx.eventBus.emit('ENDPOINT_HIT', {
      url: ctx.originalUrl,
      resolver: `${url}`,
      query,
    });

    let results;
    if (has(mgetFilterName, fValues)) {
      // mget hit
      if (s.mget) {
        results = await s
          .mget(fValues[mgetFilterName])
          .run()
          .promise();
      } else {
        ctx.status = 404;
        return;
      }
    } else {
      // search hit
      if (s.search) {
        results = await s
          .search(fValues)
          .run()
          .promise();
      } else {
        ctx.status = 404;
        return;
      }
    }

    ctx.eventBus.emit('ENDPOINT_RESOLVED', {
      value: results,
    });

    if (results) {
      ctx.state.returnValue = results;
    } else {
      ctx.status = 404;
    }
  });
};

module.exports = createManyMiddleware;
