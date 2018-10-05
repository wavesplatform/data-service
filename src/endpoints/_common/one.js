const { captureErrors } = require('../../../utils/captureErrors');
const { select } = require('../../utils/selectors');

const createGetMiddleware = (url, service) => {
  const handleError = ({ ctx, error }) => {
    ctx.eventBus.emit('ERROR', error);
    error.matchWith({
      Db: () => {
        ctx.status = 500;
        ctx.body = 'Database Error';
      },
      Resolver: () => {
        ctx.status = 500;
        ctx.body = `Error resolving ${url}/:id`;
      },
      Validation: () => {
        ctx.status = 400;
        ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
      },
    });
  };

  return captureErrors(handleError)(async ctx => {
    const s = service({
      drivers: ctx.state.drivers,
      emitEvent: ctx.eventBus.emit,
    });

    if (!s.get) {
      ctx.status = 404;
      return;
    }

    const { id } = select(ctx);

    ctx.eventBus.emit('ENDPOINT_HIT', {
      url: ctx.originalUrl,
      resolver: `${url}/:id`,
      id,
    });

    const x = await s
      .get(id)
      .run()
      .promise();

    ctx.eventBus.emit('ENDPOINT_RESOLVED', {
      value: x,
    });

    if (x) {
      ctx.state.returnValue = x;
    } else {
      ctx.status = 404;
    }
  });
};

module.exports = createGetMiddleware;
