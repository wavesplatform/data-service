const createOneMiddleware = require('./one');
const createManyMiddleware = require('./many');

const postToGet = require('../utils/postToGet');

const { ids } = require('./filters');

const create = (
  url,
  service,
  { filterParsers = { ids }, mgetFilterName = 'ids' } = {}
) => router => {
  const manyMiddleware = createManyMiddleware(
    {
      filterParsers,
      mgetFilterName,
    },
    url,
    service
  );

  return router
    .get(`${url}/:id`, createOneMiddleware(url, service))
    .get(`${url}`, manyMiddleware)
    .post(`${url}`, postToGet(manyMiddleware));
};

module.exports = create;
