const crypto = require('crypto');
const { where, whereRaw } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const byScript = s =>
  whereRaw(
    'md5(script) = ?',
    crypto
      .createHash('md5')
      .update(s)
      .digest('hex')
  );

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
