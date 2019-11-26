const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const byAssetId = assetId =>
  where('asset_uid', function() {
    this.select('uid')
      .from('assets')
      .where('asset_id', assetId)
      .limit(1);
  });

module.exports = {
  filters: {
    ...commonFilters,
    assetId: byAssetId,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId'],
};
