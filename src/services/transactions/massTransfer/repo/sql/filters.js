const pg = require('knex')({ client: 'pg' });

const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

const byRecipient = (rec) => (q) =>
  q
    .clone()
    .whereIn(
      'tx_uid',
      pg('txs_11_transfers').select('tx_uid').where('recipient_address', rec)
    );

module.exports = {
  filters: {
    ...commonFilters,

    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'recipient'],
};
