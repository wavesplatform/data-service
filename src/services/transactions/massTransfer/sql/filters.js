const { whereIn } = require('../../../../utils/db/knex');
const { selectIdsWhereRecipient } = require('./query');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const byAssetId = assetId => {
  return whereIn('asset_uid', function() {
    this.select('uid')
      .from('assets_map')
      .where('asset_id', assetId);
  });
};

const byRecipient = rec => q =>
  q.clone().whereIn('tuid', selectIdsWhereRecipient(rec));

module.exports = {
  filters: {
    ...commonFilters,
    assetId: byAssetId,
    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'recipient'],
};
