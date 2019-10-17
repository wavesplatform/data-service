const crypto = require('crypto');
const { where, whereRaw } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,
    script: s =>
      whereRaw(
        'md5(script) = ?',
        crypto
          .createHash('md5')
          .update(s)
          .digest('hex')
      ),
    assetId: where('asset_id'),
  },
  filtersOrder: [...commonFiltersOrder, 'script', 'assetId'],
};
