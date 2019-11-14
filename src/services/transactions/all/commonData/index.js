const { propEq, compose } = require('ramda');

const { withStatementTimeout } = require('../../../../db/driver');
const { getByIdPreset } = require('../../../presets/pg/getById');
const { mgetByIdsPreset } = require('../../../presets/pg/mgetByIds');
const {
  searchWithPaginationPreset,
} = require('../../../presets/pg/searchWithPagination');

const transformTxInfo = require('./transformTxInfo');
const { transaction } = require('../../../../types');

const sql = require('./sql');

const { inputGet } = require('../../../presets/pg/getById/inputSchema');
const { inputMget } = require('../../../presets/pg/mgetByIds/inputSchema');
const { result, inputSearch } = require('./schema');

const { decode, encode } = require('../../_common/cursor');

module.exports = ({ drivers: { pg }, emitEvent, timeouts }) => {
  return {
    get: getByIdPreset({
      name: 'transactions.all.commonData.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: result,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.get, timeouts.default),
      emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'transactions.all.commonData.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      resultTypeFactory: transaction,
      inputSchema: inputMget,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.mget, timeouts.default),
      emitEvent,
    }),

    search: searchWithPaginationPreset({
      name: 'transactions.all.commonData.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema: result,
      transformResult: compose(transaction, transformTxInfo),
      cursor: {
        decode,
        encode,
      },
    })({
      pg: withStatementTimeout(pg, timeouts.search, timeouts.default),
      emitEvent,
    }),
  };
};
