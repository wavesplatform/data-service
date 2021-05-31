const pg = require('knex')({ client: 'pg' });
const { curryN } = require('ramda');
const { BigNumber } = require('@waves/data-entities');

const commonFilters = require('../../../../_common/sql/filters');

const byKey = curryN(2, (key, q) =>
  q.clone().whereIn('t.uid', function() {
    this.select('tx_uid')
      .from('txs_12_data')
      .where('data_key', key);
  })
);

const byType = curryN(2, (type, q) =>
  q.clone().whereIn('t.uid', function() {
    this.select('tx_uid')
      .from('txs_12_data')
      .where('data_type', type);
  })
);

const byValue = curryN(3, (type, value, q) => {
  const v = value instanceof BigNumber ? value.toString() : value;
  return q.clone().whereIn('t.uid', function() {
    this.select('tx_uid')
      .from('txs_12_data')
      .where('data_type', type)
      .andWhere(`data_value_${type}`, v);
  });
});

const byTimeStamp = (comparator) => (ts) => (q) =>
  q
    .clone()
    .where(
      't.uid',
      comparator,
      pg('txs_12')
        .select('uid')
        .where('time_stamp', comparator, ts.toISOString())
        .orderByRaw(`time_stamp <-> '${ts.toISOString()}'::timestamptz`)
        .limit(1)
    );

module.exports = {
  ...commonFilters,
  
  key: byKey,
  type: byType,
  value: byValue,
  timeStart: byTimeStamp('>='),
  timeEnd: byTimeStamp('<='),
};
