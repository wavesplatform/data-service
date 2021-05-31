const pg = require('knex')({ client: 'pg' });
const commonFilters = require('../../../../_common/sql/filters');
const commonFiltersOrder = require('../../../../_common/sql/filtersOrder');

const byRecipient = (addressOrAlias) => (q) =>
  q
    .clone()
    .whereRaw(
      `tfs.recipient_address = coalesce((select sender from txs_10 where alias = '${addressOrAlias}' limit 1), '${addressOrAlias}')`
    );

const byTimeStamp = (comparator) => (ts) => (q) =>
  q
    .clone()
    .where(
      't.uid',
      comparator,
      pg('txs_11')
        .select('uid')
        .where('time_stamp', comparator, ts.toISOString())
        .orderByRaw(`time_stamp <-> '${ts.toISOString()}'::timestamptz`)
        .limit(1)
    );
    
module.exports = {
  filters: {
    ...commonFilters,

    recipient: byRecipient,
    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
  },
  filtersOrder: [...commonFiltersOrder, 'timeStart', 'timeEnd', 'assetId', 'recipient'],
};
