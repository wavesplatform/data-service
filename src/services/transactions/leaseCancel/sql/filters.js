const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

// txs_9 do not contain recipient info directly
// only txs_8 do
const recipient = r => q =>
  q.clone().whereIn('lease_id', function() {
    this.select('id')
      .from('txs_8')
      .where('recipient', r);
  });

module.exports = {
  filters: {
    ...commonFilters,
    recipient,
  },
  filtersOrder: [...commonFiltersOrder, 'recipient'],
};
