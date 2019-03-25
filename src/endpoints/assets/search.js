const Router = require('koa-router');
const { captureErrors } = require('../../utils/captureErrors');
const { select } = require('../utils/selectors');
const { parseFilterValues, after, limit } = require('../_common/filters');
const service = require('../../services/assets');

const subrouter = Router();

const url = '/assets/search/:phrase';

const assetsSearch = async ctx => {
  const assets = service({
    drivers: ctx.state.drivers,
    emitEvent: ctx.eventBus.emit,
  });

  const { fromParams } = select(ctx);
  const [phrase] = fromParams(['phrase']);

  const { query } = select(ctx);

  const fValues = parseFilterValues({
    after,
    limit,
  })(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: `${url}`,
    query,
  });

  let results = await assets
    .search({
      phrase,
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

subrouter.get(url, captureErrors(handleError)(assetsSearch));

module.exports = subrouter;
