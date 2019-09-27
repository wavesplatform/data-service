const crypto = require('crypto');
const { whereRaw } = require('../../../../utils/db/knex');

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
  },
  filtersOrder: [...commonFiltersOrder, 'script'],
};
