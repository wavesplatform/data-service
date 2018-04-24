const createAssetsResolver = require('../resolvers/assets');
const { getIdsFromCtx } = require('../utils/getters');
const { captureErrors } = require('../utils/captureErrors');

const assetsResolver = async ctx => {
  const ids = getIdsFromCtx(ctx);
  ctx.log({
    level: 'info',
    message: `Assets endpoint hit: ${JSON.stringify(ctx.originalUrl)}`,
  });
  const resolver = createAssetsResolver({
    db: ctx.state.db,
    log: ctx.log,
  });

  const assets = await resolver
    .many(ids)
    .run()
    .promise();

  ctx.log({
    level: 'info',
    message: 'Assets endpoint resolved:' + JSON.stringify(assets),
  });
  ctx.body = assets;
};

const handleError = ({ ctx, error }) =>
  error.matchWith({
    Db: ({ error, meta }) => {
      ctx.log({
        level: 'error',
        message: `DbError\t${error.message}\t${JSON.stringify(meta)}`,
      });
      ctx.status = 500;
      ctx.body = 'Database Error';
    },
    Resolver: ({ error, meta }) => {
      ctx.log({
        level: 'error',
        message: `ResolverError\t${meta.resolver}\t${error.message}`,
      });
      ctx.status = 500;
      ctx.body = 'Error resolving /assets';
    },
    Validation: ({ error, meta }) => {
      ctx.log({
        level: 'error',
        message: `${meta.error}, got ${meta.value}\n${error.stack}`,
      });
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });

module.exports = captureErrors(handleError)(assetsResolver);
