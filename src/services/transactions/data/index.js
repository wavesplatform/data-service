const { identity, compose } = require('ramda');

const { get, mget, search } = require('../../_common/createResolver');
const { transaction } = require('../../../types');

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

const {
  transformResults: transformResultGet,
} = require('../../presets/pg/getById/transformResult');
const {
  transformResults: transformResultMget,
} = require('../../presets/pg/mgetByIds/transformResult');
const {
  transformInput: transformInputSearch,
} = require('../../presets/pg/searchWithPagination/transformInput');
const {
  transformResults: transformResultSearch,
} = require('../../presets/pg/searchWithPagination/transformResult');
const transformTxInfo = require('./transformTxInfo');

const createServiceName = type => `transactions.data.${type}`;

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: get({
      transformInput: identity,
      transformResult: transformResultGet(transaction)(transformTxInfo),
      validateInput: validateInput(inputGet, createServiceName('get')),
      validateResult: validateResult(resultSchema, createServiceName('get')),
      getData: pgData.get(pg),
    })({ emitEvent }),

    mget: mget({
      transformInput: identity,
      transformResult: transformResultMget(transaction)(transformTxInfo),
      validateInput: validateInput(inputMget, createServiceName('mget')),
      validateResult: validateResult(resultSchema, createServiceName('mget')),
      getData: pgData.mget(pg),
    })({ emitEvent }),

    search: search({
      transformInput: transformInputSearch,
      transformResult: transformResultSearch(
        compose(
          transaction,
          transformTxInfo
        )
      ),
      validateInput: validateInput(
        inputSearchSchema,
        createServiceName('search')
      ),
      validateResult: validateResult(resultSchema, createServiceName('search')),
      getData: pgData.search(pg),
    })({ emitEvent }),
  };
};
