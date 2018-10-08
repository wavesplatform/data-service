const { where } = require('../../../../utils/db/knex');
const { selectIdsWhereRecipient } = require('./query');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const recipient = rec => q =>
  q.clone().whereIn('txs_11.id', selectIdsWhereRecipient(rec));
const assetId = where('asset_id');

module.exports = {
  filters: {
    ...commonFilters,
    assetId,
    recipient,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'recipient'],
};
