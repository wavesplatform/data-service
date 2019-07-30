const Router = require('koa-router');

const createEndpoint = require('../_common');
const { ids, limit, after, query } = require('../_common/filters');

module.exports = assetsService =>
  createEndpoint('/assets', assetsService, {
    filterParsers: {
      ids,
      limit,
      after,
      ticker: query,
      search: query,
    },
  })(new Router());
