const { propEq } = require('ramda');

const { Transaction } = require('../../../types');

const getByIdPreset = require('../../presets/pg/getById');
const mgetByIdsPreset = require('../../presets/pg/mgetByIds');

const transformTxInfo = require('./transformTxInfo');

const sql = require('./sql');

const { result } = require('./schema');

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'transactions.burn.get',
      sql: sql.get,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset({
      name: 'transactions.burn.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      resultTypeFactory: Transaction,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),
  };
};
