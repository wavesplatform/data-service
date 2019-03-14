const { propEq, compose } = require('ramda');

const { getByIdPreset } = require('../../presets/pg/getById');
const { mgetByIdsPreset } = require('../../presets/pg/mgetByIds');
const { inputGet } = require('../../presets/pg/getById/inputSchema');
const { inputMget } = require('../../presets/pg/mgetByIds/inputSchema');
const {
  searchWithPaginationPreset,
} = require('../../presets/pg/searchWithPagination');

const transformTxInfo = require('./transformTxInfo');
const { transaction } = require('../../../types');

const sql = require('./sql');

const { result, inputSearch } = require('./schema');

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'transactions.setAssetScript.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: result,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset({
      name: 'transactions.setAssetScript.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset({
      name: 'transactions.setAssetScript.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema: result,
      transformResult: compose(
        transaction,
        transformTxInfo
      ),
    })({ pg, emitEvent }),
  };
};
