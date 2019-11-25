const { without, omit } = require('ramda');

const { where } = require('../../../../utils/db/knex');
const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

module.exports = {
  filters: omit(['sender'], {
    ...commonFilters,
    recipient: where('recipient'),
  }),

  filtersOrder: without('sender', [...commonFiltersOrder, 'recipient']),
};
