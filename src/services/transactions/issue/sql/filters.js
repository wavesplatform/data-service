const { md5 } = require('../../../../utils/hash');
const { where, whereRaw } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const byScript = s => whereRaw('md5(script) = ?', md5(s));

const byAssetId = assetId =>
  where('asset_uid', function() {
    this.select('uid')
      .from('assets')
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
