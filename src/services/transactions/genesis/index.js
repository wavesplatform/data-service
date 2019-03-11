const { propEq } = require('ramda');

const { transaction } = require('../../../types');

const { getByIdPreset } = require('../../presets/pg/getById');
const { mgetByIdsPreset } = require('../../presets/pg/mgetByIds');
const { inputGet } = require('../../presets/pg/getById/inputSchema');
const { inputMget } = require('../../presets/pg/mgetByIds/inputSchema');
const {
  searchWithPaginationPreset,
} = require('../../presets/pg/searchWithPagination');

const transformTxInfo = require('../_common/transformTxInfo');

const sql = require('./sql');

const {
  result: resultSchema,
  inputSearch: inputSearchSchema,
} = require('./schema');

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'transactions.genesis.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset({
      name: 'transactions.genesis.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset({
      name: 'transactions.genesis.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),
  };
};
