const { selectIdsWhereRecipient } = require('./query');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const byRecipient = rec => q =>
  q.clone().whereIn('tx_uid', selectIdsWhereRecipient(rec));

module.exports = {
  filters: {
    ...commonFilters,
    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'recipient'],
};
