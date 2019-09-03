const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const byScript = where('script');

const byAssetId = assetId =>
  where('asset_uid', function() {
    this.select('uid')
      .from('assets_map')
      .where('asset_id', assetId);
  });

module.exports = {
  filters: {
    ...commonFilters,
    script: byScript,
    assetId: byAssetId,
  },
  filtersOrder: [...commonFiltersOrder, 'script', 'assetId'],
};
