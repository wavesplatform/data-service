const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const script = where('script');
const assetId = where('asset_id');

module.exports = {
  filters: {
    ...commonFilters,
    script,
    assetId,
  },
  filtersOrder: [...commonFiltersOrder, 'script', 'assetId'],
};
