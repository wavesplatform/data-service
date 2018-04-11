const Router = require('koa-router');
const koaBody = require('koa-bodyparser');
const { createGraphQl, createGraphiQl } = require('./graphql');

module.exports = ({ db }) => {
  const router = new Router();
  const gql = createGraphQl({ db });
  router.post('/graphql', koaBody(), gql);
  router.get('/graphql', gql);
  router.get('/graphiql', createGraphiQl({ endpointURL: '/graphql' }));
  return router;
};
