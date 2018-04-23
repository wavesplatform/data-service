const createAssetsResolver = require('../resolvers/assets');
const { getIdsFromCtx } = require('../utils/getters');

module.exports = async (ctx, next) => {
  const ids = getIdsFromCtx(ctx);
  ctx.log({
    level: 'info',
    message: `Assets endpoint hit: ${JSON.stringify(ctx.path)}`,
  });
  const resolver = createAssetsResolver({
    db: ctx.state.db,
    log: ctx.log,
  });

  await resolver(ids)
    .run()
    .promise()
    .then(assets => {
      ctx.log({
        level: 'info',
        message: 'Assets endpoint resolved:' + JSON.stringify(assets),
      });
      ctx.body = assets;
    })
    .catch(error => handleError({ error, ctx }));

  await next();
};

const handleError = ({ ctx, error }) => {
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
  });
};
