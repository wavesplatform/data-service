const { version } = require('../../package.json');

module.exports = async ctx => {
  ctx.state.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
  });
  ctx.state.eventBus.emit('ENDPOINT_RESOLVED', {
    value: version,
  });
  ctx.body = version;
};
