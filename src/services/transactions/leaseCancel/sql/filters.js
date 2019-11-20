const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

// txs_9 do not contain recipient info directly
// only txs_8 do
const byRecipient = r => q =>
  q.clone().whereIn('lease_tx_uid', function() {
    this.select('txs.uid')
      .from({ t: 'txs_8' })
      .leftJoin('txs', 'txs.uid', 't.tx_uid')
      .where('recipient_uid', function() {
        this.select('uid')
          .from('addresses')
          .where('address', r);
      });
  });

module.exports = {
  filters: {
    ...commonFilters,
    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'recipient'],
};
