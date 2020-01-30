const { whereIn } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

// txs_9 do not contain recipient info directly
// only txs_8 do
const byRecipient = r =>
  whereIn('lease_tx_uid', function() {
    this.select('tx_uid')
      .from('txs_8')
      .where('recipient_address_uid', function() {
        this.select('uid')
          .from('addresses')
          .where('address', r)
          .limit(1);
      });
  });

module.exports = {
  filters: {
    ...commonFilters,
    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'recipient'],
};
