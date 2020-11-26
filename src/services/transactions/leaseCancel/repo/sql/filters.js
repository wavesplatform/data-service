const { whereIn } = require('../../../../../utils/db/knex');

const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

// txs_9 do not contain recipient info directly
// only txs_8 do
const byRecipient = (addressOrAlias) =>
  whereIn('lease_tx_uid', function () {
    this.select('uid')
      .from('txs_8')
      .whereRaw(
        `recipient_address = coalesce((select sender from txs_10 where alias = '${addressOrAlias}' limit 1), '${addressOrAlias}')`
      );
  });

module.exports = {
  filters: {
    ...commonFilters,

    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'recipient'],
};
