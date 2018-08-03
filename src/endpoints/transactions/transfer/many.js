const createService = require('../../../services/transactions/transfer');

const { captureErrors } = require('../../../utils/captureErrors');
const { select } = require('../../utils/selectors');
const { selectFilters } = require('./utils');

/**
 * Endpoint
 * @name /transactions/transfer
 */
const transferTxsManyEndpoint = async ctx => {
  const { query } = select(ctx);
  const filters = selectFilters(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'transactions.transfer.many',
    filters,
  });

  const service = createService({
    drivers: ctx.state.drivers,
    emitEvent: ctx.eventBus.emit,
  });

  const txs = await service
    .search(filters)
    .run()
    .promise();

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
      ctx.body = 'Error resolving /transactions/transfer';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(transferTxsManyEndpoint);
