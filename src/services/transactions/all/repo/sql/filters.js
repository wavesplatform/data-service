const knex = require('knex');
const pg = knex({ client: 'pg' });
const commonFilters = require('../../../_common/sql/filters');

const byTimeStamp = (comparator) => (ts) => (q) => {
  const sortDirection = comparator === '>' ? 'asc' : 'desc';
  const cteName = `cte_${sortDirection}`;
  return q
    .clone()
    .with(cteName, function () {
      this.select('uid')
        .from('txs')
        .where('time_stamp', comparator, ts)
        .orderBy('uid', sortDirection)
        .limit(1);
    })
    .where('uid', comparator, pg(cteName).select('uid'));
};

const after = ({ tx_uid, sort }) => (q) => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q.clone().whereRaw(`t.uid ${comparator} ${tx_uid.toString()}`);
};

module.exports = {
  filters: {
    ...commonFilters,
    timeStart: byTimeStamp('>'),
    timeEnd: byTimeStamp('<'),
    sort: (s) => (q) => q.clone().orderBy('t.uid', s),
    after,
  },
};
