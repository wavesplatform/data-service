const { version } = require('../../package.json');

module.exports = async ctx => {
  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
  });

  ctx.state.returnValue = {
    version,
    github: 'https://github.com/wavesplatform/data-service',
  };

  if (process.env.DOCS_URL)
    ctx.state.returnValue.docsUrl = process.env.DOCS_URL;

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: ctx.state.returnValue,
  });
};
