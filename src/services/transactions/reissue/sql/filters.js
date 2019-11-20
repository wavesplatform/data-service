const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const assetId = assetId =>
  where('t.asset_uid', function() {
    this.select('uid')
      .from('assets')
      .where('asset_id', assetId);
  });

module.exports = {
  filters: {
    ...commonFilters,
    assetId,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId'],
};
