const Router = require('koa-router');

const createEndpoint = require('../_common');
const { ids, limit, after } = require('../_common/filters');

const createService = require('../../services/assets');

module.exports = createEndpoint('/assets', createService, {
  filterParsers: {
    ids,
    limit,
    after,
    ticker: x => x,
    search: x => x,
  },
})(new Router());
