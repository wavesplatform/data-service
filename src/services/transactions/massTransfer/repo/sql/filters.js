const pg = require('knex')({ client: 'pg' });

const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

const byRecipient = (addressOrAlias) => (q) =>
  q
    .clone()
    .whereIn(
      'tx_uid',
      pg('txs_11_transfers')
        .select('tx_uid')
        .whereRaw(
          `recipient_address = coalesce((select sender from txs_10 where alias = '${addressOrAlias}' limit 1), '${addressOrAlias}')`
        )
    );

module.exports = {
  filters: {
    ...commonFilters,

    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'recipient'],
};
