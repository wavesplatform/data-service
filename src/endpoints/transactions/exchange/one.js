const createService = require('../../../services/transactions/exchange');
const { captureErrors } = require('../../../utils/captureErrors');
const { select } = require('../../utils/selectors');

const exchangeTxsEndpointOne = async ctx => {
  const { id } = select(ctx);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'txsExchangeOne',
    id,
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
    ctx.body = `Exchange tx ${id} not found`;
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
      ctx.body = 'Error resolving /transactions/exchange';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(exchangeTxsEndpointOne);
