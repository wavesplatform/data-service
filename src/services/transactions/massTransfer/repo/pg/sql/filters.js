const { createByTimeStamp, createByBlockTimeStamp } = require('../../../../_common/sql');
const commonFilters = require('../../../../_common/sql/filters');
const commonFiltersOrder = require('../../../../_common/sql/filtersOrder');

const byRecipient = (addressOrAlias) => (q) =>
  q
    .clone()
    .whereRaw(
      `tfs.recipient_address = coalesce((select sender from txs_10 where alias = '${addressOrAlias}' limit 1), '${addressOrAlias}')`
    );

const byTimeStamp = createByTimeStamp('txs_11');

const byBlockTimeStamp = createByBlockTimeStamp('txs_11');

module.exports = {
  filters: {
    ...commonFilters,

    recipient: byRecipient,
    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
    blockTimeStart: byBlockTimeStamp('>='),
    blockTimeEnd: byBlockTimeStamp('<='),
  },
  filtersOrder: [...commonFiltersOrder, 'timeStart', 'timeEnd', 'assetId', 'recipient'],
};
