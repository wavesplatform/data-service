const { DEFAULT_NOT_FOUND_MESSAGE } = require('../../errorHandling');
const { captureErrors } = require('../../utils/captureErrors');
const { handleError } = require('../../utils/handleError');
const { select } = require('../utils/selectors');

const createGetMiddleware = (url, service) => {
  return captureErrors(handleError)(async ctx => {
    const s = service({
      drivers: ctx.state.drivers,
      emitEvent: ctx.eventBus.emit,
    });

    if (!s.get) {
      ctx.status = 404;
      ctx.body = {
        message: DEFAULT_NOT_FOUND_MESSAGE,
      };
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

    x.matchWith({
      Just: ({ value }) => (ctx.state.returnValue = value),
      Nothing: () => {
        ctx.status = 404;
        ctx.body = {
          message: DEFAULT_NOT_FOUND_MESSAGE,
        };
      },
    });
  });
};

module.exports = createGetMiddleware;
