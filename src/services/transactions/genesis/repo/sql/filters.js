const { without, omit } = require('ramda');

const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

module.exports = {
  filters: omit(['sender'], {
    ...commonFilters,
    
    timeStart: commonFilters.timeStart(1),
    timeEnd: commonFilters.timeEnd(1),
  }),

  filtersOrder: without('sender', [...commonFiltersOrder, 'recipient']),
};
