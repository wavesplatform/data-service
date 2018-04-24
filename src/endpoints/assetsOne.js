const createAssetsResolver = require('../resolvers/assets');
const { getIdFromCtx } = require('../utils/getters');
const { captureErrors } = require('../utils/captureErrors');

const assetResolver = async (ctx, next) => {
  const id = getIdFromCtx(ctx);
  ctx.log({
    level: 'info',
    message: `Asset endpoint hit: ${JSON.stringify(ctx.path)}, ${id}`,
  });
  const resolver = createAssetsResolver({
    db: ctx.state.db,
    log: ctx.log,
  });

  const assets = await resolver
    .one(id)
    .run()
    .promise();

  ctx.log({
    level: 'info',
    message: 'Asset endpoint resolved:' + JSON.stringify(assets),
  });
  ctx.body = assets;

  await next();
};

const handleError = ({ ctx, error }) => {
  error.matchWith({
    Db: ({ error, meta }) => {
      ctx.log({
        level: 'error',
        message: `DbError:\t${error.message}\t${JSON.stringify(meta)}`,
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
      ctx.body = 'Error resolving /asset';
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
};
module.exports = captureErrors(handleError)(assetResolver);
