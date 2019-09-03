const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

// txs_9 do not contain recipient info directly
// only txs_8 do
// @todo change lease_id to lease_uid (after db modification)
const byRecipient = r => q =>
  q.clone().whereIn('lease_id', function() {
    this.select('txs.id')
      .from({ t: 'txs_8' })
      .leftJoin('txs', 'txs.uid', 't.tuid')
      .where('recipient_uid', function() {
        this.select('uid')
          .from('addresses_map')
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
