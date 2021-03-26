const commonFilters = require('../../../../_common/sql/filters');
const commonFiltersOrder = require('../../../../_common/sql/filtersOrder');

const byRecipient = (addressOrAlias) => (q) =>
  q
    .clone()
    .whereRaw(
      `tfs.recipient_address = coalesce((select sender from txs_10 where alias = '${addressOrAlias}' limit 1), '${addressOrAlias}')`
    );

module.exports = {
  filters: {
    ...commonFilters,

    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'recipient'],
};
