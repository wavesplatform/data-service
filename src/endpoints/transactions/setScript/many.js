const createService = require('../../../services/transactions/setScript');

const { captureErrors } = require('../../../utils/captureErrors');
const { select } = require('../../utils/selectors');
const { hasOnlyIds } = require('../../utils/hasOnlyIds');
const { selectFilters } = require('./utils');

/**
 * Endpoint
 * @name /transactions/set-script
 */
const setScriptTxsManyEndpoint = async ctx => {
  const { query } = select(ctx);
  const filters = selectFilters(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'transactions.setScript.many',
    filters,
  });

  const service = createService({
    drivers: ctx.state.drivers,
    emitEvent: ctx.eventBus.emit,
  });

  let txs;
  if (filters.ids) {
    if (!hasOnlyIds(filters)) {
      ctx.status = 400;
      ctx.body = 'Invalid query: either request by ids, or by other filters.';
    }
    // mget request
    txs = await service
      .mget(filters.ids)
      .run()
      .promise();
  } else {
    txs = await service
      .search(filters)
      .run()
      .promise();
  }

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: txs,
  });

  ctx.state.returnValue = txs;
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
      ctx.body = 'Error resolving /transactions/set-script';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(setScriptTxsManyEndpoint);
