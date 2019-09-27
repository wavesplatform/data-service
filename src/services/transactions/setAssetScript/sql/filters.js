const { where, whereRaw } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,
    assetId: where('asset_id'),
    script: whereRaw('md5(script) = md5(?)'),
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'script'],
};
