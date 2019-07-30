const createOneMiddleware = require('./one');
const createManyMiddleware = require('./many');

const postToGet = require('../utils/postToGet');

const { ids } = require('./filters');

const create = (
  url,
  serviceSlug,
  { filterParsers = { ids }, parseFiltersFn, mgetFilterName = 'ids' } = {}
) => router => {
  const manyMiddleware = createManyMiddleware(
    {
      parseFiltersFn,
      filterParsers,
      mgetFilterName,
    },
    url,
    serviceSlug
  );

  return router
    .get(`${url}/:id`, createOneMiddleware(url, serviceSlug))
    .get(`${url}`, manyMiddleware)
    .post(`${url}`, postToGet(manyMiddleware));
};

module.exports = create;
