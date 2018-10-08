const { reject, isNil } = require('ramda');
const { parseDate } = require('../../../utils/parseDate');

const selectFilters = ({
  sender,
  after,
  timeStart,
  timeEnd,
  sort = 'desc',
  limit = 100,
}) =>
  reject(isNil, {
    timeStart: timeStart && parseDate(timeStart),
    timeEnd: timeEnd && parseDate(timeEnd),
    limit: parseInt(limit),
    sort,
    sender,
    after,
  });

module.exports = { selectFilters };
