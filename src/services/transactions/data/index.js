const { identity } = require('ramda');

const createResolver = require('../../../resolvers/create');

// validation
const { input: inputGet } = require('../../presets/pg/getById/inputSchema');
const { validateInput, validateResult } = require('../../presets/validation');
const { result, inputSearch } = require('./schema');

// data retrieve
const pgData = require('./pg');

// transforms
const transformResultGet = require('../../presets/pg/getById/transformResult');
const transformInputSearch = require('../../presets/pg/searchWithPagination/transformInput');
const transformResultSearch = require('../../presets/pg/searchWithPagination/transformResult');
const transformTxInfo = require('./transformTxInfo');

const createServiceName = type => `transactions.data.${type}`;

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: createResolver.get({
      transformInput: identity,
      transformResult: transformResultGet(transformTxInfo),
      validateInput: validateInput(inputGet, createServiceName('get')),
      validateResult: validateResult(result, createServiceName('get')),
      dbQuery: pgData.get,
    })({ db: pg, emitEvent }),

    // mget: createResolver.mget({
    //   transformInput: identity,
    //   transformResult: transformResultGet(transformTxInfo),
    //   validateInput: validateInput(inputGet, createServiceName('get')),
    //   validateResult: validateResult(result, createServiceName('get')),
    //   dbQuery: pgData.get,
    // })({ db: pg, emitEvent }),

    search: createResolver.search({
      transformInput: transformInputSearch,
      transformResult: transformResultSearch(transformTxInfo),
      validateInput: validateInput(inputSearch, createServiceName('search')),
      validateResult: validateResult(result, createServiceName('search')),
      dbQuery: pgData.search,
    })({ db: pg, emitEvent }),
  };
};
