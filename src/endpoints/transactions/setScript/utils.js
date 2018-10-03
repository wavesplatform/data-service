const { reject, isNil } = require('ramda');
const { parseDate } = require('../../../utils/parseDate');

const selectFilters = ({
  // mget
  ids,
  // search
  sender,
  script,
  after,
  timeStart,
  timeEnd,
  sort = 'desc',
  limit = 100,
}) =>
  reject(isNil, {
    ids,
    timeStart: timeStart && parseDate(timeStart),
    timeEnd: timeEnd && parseDate(timeEnd),
    limit: parseInt(limit),
    sort,
    script,
    sender,
    after,
  });

module.exports = { selectFilters };
