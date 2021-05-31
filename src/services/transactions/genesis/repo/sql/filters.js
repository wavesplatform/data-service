const pg = require('knex')({ client: 'pg' });
const { without, omit } = require('ramda');

const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');


const byTimeStamp = (comparator) => (ts) => (q) =>
  q
    .clone()
    .where(
      't.uid',
      comparator,
      pg('txs_1')
        .select('uid')
        .where('time_stamp', comparator, ts.toISOString())
        .orderByRaw(`time_stamp <-> '${ts.toISOString()}'::timestamptz`)
        .limit(1)
    );

module.exports = {
  filters: omit(['sender'], {
    ...commonFilters,
    
    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
  }),

  filtersOrder: without('sender', [...commonFiltersOrder, 'recipient']),
};
