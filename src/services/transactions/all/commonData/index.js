const { propEq } = require('ramda');

const { Transaction } = require('../../../../types');

const getByIdPreset = require('../../../presets/pg/getById');
const mgetByIdsPreset = require('../../../presets/pg/mgetByIds');
const searchWithPaginationPreset = require('../../../presets/pg/searchWithPagination');

const transformTxInfo = require('./transformTxInfo');

const sql = require('./sql');

const { result, inputSearch } = require('./schema');

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'transactions.all.commonData.get',
      sql: sql.get,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset({
      name: 'transactions.all.commonData.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      resultTypeFactory: Transaction,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset({
      name: 'transactions.all.commonData.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),
  };
};
