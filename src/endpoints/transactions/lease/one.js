const createService = require('../../../services/transactions/lease');
const { select } = require('../../utils/selectors');
const { captureErrors } = require('../../../utils/captureErrors');

/**
 * Endpoint
 * @name /transactions/lease/:id
 */
const leaseTxsOneEndpoint = async ctx => {
  const { id } = select(ctx);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'transactions.lease.one',
  });

  const service = createService({
    drivers: ctx.state.drivers,
    emitEvent: ctx.eventBus.emit,
  });

  const tx = await service
    .get(id)
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: tx,
  });

  if (tx) {
    ctx.state.returnValue = tx;
  } else {
    ctx.status = 404;
    ctx.body = `Lease tx with id=${id} not found`;
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
      ctx.body = 'Error resolving /transactions/lease';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(leaseTxsOneEndpoint);
