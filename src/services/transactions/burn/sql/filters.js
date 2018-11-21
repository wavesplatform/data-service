const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const assetId = where('t.asset_id');

module.exports = {
  filters: {
    ...commonFilters,
    assetId,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId'],
};
