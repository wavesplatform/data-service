const { curryN } = require('ramda');
const { BigNumber } = require('@waves/data-entities');

const { createByTimeStamp, createByBlockTimeStamp } = require('../../../../_common/sql');
const commonFilters = require('../../../../_common/sql/filters');

const byKey = curryN(2, (key, q) =>
  q.clone().whereIn('t.uid', function () {
    this.select('tx_uid').from('txs_12_data').where('data_key', key);
  })
);

const byType = curryN(2, (type, q) =>
  q.clone().whereIn('t.uid', function () {
    this.select('tx_uid').from('txs_12_data').where('data_type', type);
  })
);

const byValue = curryN(3, (type, value, q) => {
  const v = value instanceof BigNumber ? value.toString() : value;
  return q.clone().whereIn('t.uid', function () {
    this.select('tx_uid')
      .from('txs_12_data')
      .where('data_type', type)
      .andWhere(`data_value_${type}`, v);
  });
});

const byTimeStamp = createByTimeStamp('txs_12');

const byBlockTimeStamp = createByBlockTimeStamp('txs_12');

module.exports = {
  ...commonFilters,

  key: byKey,
  type: byType,
  value: byValue,
  timeStart: byTimeStamp('>='),
  timeEnd: byTimeStamp('<='),
  blockTimeStart: byBlockTimeStamp('>='),
  blockTimeEnd: byBlockTimeStamp('<='),
};
