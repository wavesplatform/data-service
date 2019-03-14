const { propEq, compose } = require('ramda');

const { getByIdPreset } = require('../../presets/pg/getById');
const { mgetByIdsPreset } = require('../../presets/pg/mgetByIds');
const { inputGet } = require('../../presets/pg/getById/inputSchema');
const { inputMget } = require('../../presets/pg/mgetByIds/inputSchema');
const {
  searchWithPaginationPreset,
} = require('../../presets/pg/searchWithPagination');

const transformTxInfo = require('../_common/transformTxInfo');
const { transaction } = require('../../../types');

const sql = require('./sql');

const {
  result: resultSchema,
  inputSearch: inputSearchSchema,
} = require('./schema');

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'transactions.lease.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset({
      name: 'transactions.lease.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset({
      name: 'transactions.lease.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: compose(
        transaction,
        transformTxInfo
      ),
    })({ pg, emitEvent }),
  };
};
