const { reject, isNil } = require('ramda');
const { parseDate } = require('../../../utils/parseDate');

const selectFilters = ({
  timeStart, // No default value for timestart, other way - bad for desc pagination
  timeEnd,
  sender,
  limit = 100,
  sort = 'desc',
  key,
  type,
  value,
  after,
}) =>
  reject(isNil, {
    timeStart: timeStart && parseDate(timeStart),
    timeEnd: timeEnd && parseDate(timeEnd),
    limit,
    sort,
    sender,
    key,
    type,
    value,
    after,
  });

module.exports = { selectFilters };
