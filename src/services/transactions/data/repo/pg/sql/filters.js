const { curryN } = require('ramda');
const { BigNumber } = require('@waves/data-entities');

const commonFilters = require('../../../../_common/sql/filters');

const byKey = curryN(2, (key, q) =>
  q.clone().whereIn('t.tx_uid', function() {
    this.select('tx_uid')
      .from('txs_12_data')
      .where('data_key', key);
  })
);

const byType = curryN(2, (type, q) =>
  q.clone().whereIn('t.tx_uid', function() {
    this.select('tx_uid')
      .from('txs_12_data')
      .where('data_type', type);
  })
);

const byValue = curryN(3, (type, value, q) => {
  const v = value instanceof BigNumber ? value.toString() : value;
  return q.clone().whereIn('t.tx_uid', function() {
    this.select('tx_uid')
      .from('txs_12_data')
      .where('data_type', type)
      .andWhere(`data_value_${type}`, v);
  });
});

module.exports = {
  ...commonFilters,
  
  timeStart: commonFilters.timeStart(12),
  timeEnd: commonFilters.timeEnd(12),
  key: byKey,
  type: byType,
  value: byValue,
};
