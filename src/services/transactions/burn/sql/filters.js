const { whereIn } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const assetId = assetId =>
  whereIn('asset_uid', function() {
    this.select('uid')
      .from('assets_map')
      .where('asset_id', assetId)
      .limit(1);
  });

module.exports = {
  filters: {
    ...commonFilters,
    assetId,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId'],
};
