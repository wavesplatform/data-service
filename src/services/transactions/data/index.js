const { identity } = require('ramda');

const createResolver = require('../../_common/createResolver');

// validation
const { inputGet } = require('../../presets/pg/getById/inputSchema');
const { inputMget } = require('../../presets/pg/mgetByIds/inputSchema');
const { validateInput, validateResult } = require('../../presets/validation');
const {
  result: resultSchema,
  inputSearch: inputSearchSchema,
} = require('./schema');

// data retrieve
const pgData = require('./pg');

// transforms
const { Transaction } = require('../../../types');

const transformResultGet = require('../../presets/pg/getById/transformResult');
const transformResultMget = require('../../presets/pg/mgetByIds/transformResult');
const transformInputSearch = require('../../presets/pg/searchWithPagination/transformInput');
const transformResultSearch = require('../../presets/pg/searchWithPagination/transformResult');
const transformTxInfo = require('./transformTxInfo');

const createServiceName = type => `transactions.data.${type}`;

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: createResolver.get({
      transformInput: identity,
      transformResult: transformResultGet(Transaction)(transformTxInfo),
      validateInput: validateInput(inputGet, createServiceName('get')),
      validateResult: validateResult(resultSchema, createServiceName('get')),
      dbQuery: pgData.get,
    })({ db: pg, emitEvent }),

    mget: createResolver.mget({
      transformInput: identity,
      transformResult: transformResultMget(Transaction)(transformTxInfo),
      validateInput: validateInput(inputMget, createServiceName('mget')),
      validateResult: validateResult(resultSchema, createServiceName('mget')),
      dbQuery: pgData.mget,
    })({ db: pg, emitEvent }),

    search: createResolver.search({
      transformInput: transformInputSearch,
      transformResult: transformResultSearch(transformTxInfo),
      validateInput: validateInput(
        inputSearchSchema,
        createServiceName('search')
      ),
      validateResult: validateResult(resultSchema, createServiceName('search')),
      dbQuery: pgData.search,
    })({ db: pg, emitEvent }),
  };
};
