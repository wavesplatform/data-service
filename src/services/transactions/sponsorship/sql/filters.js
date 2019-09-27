const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,
    assetId: where('t.asset_id'),
  },
  filtersOrder: [...commonFiltersOrder, 'assetId'],
};
