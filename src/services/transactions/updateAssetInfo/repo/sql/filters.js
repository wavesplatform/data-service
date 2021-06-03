const pg = require('knex')({ client: 'pg' });
const { where } = require('../../../../../utils/db/knex');

const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');


const byTimeStamp = (comparator) => (ts) => (q) =>
  q
    .clone()
    .where(
      't.uid',
      comparator,
      pg('txs_17')
        .select('uid')
        .where('time_stamp', comparator, ts.toISOString())
        .orderByRaw(`time_stamp <-> '${ts.toISOString()}'::timestamptz`)
        .limit(1)
    );

module.exports = {
  filters: {
    ...commonFilters,
    
    assetId: where('asset_id'),
    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
  },
  filtersOrder: [...commonFiltersOrder, 'timeStart', 'timeEnd', 'assetId'],
};