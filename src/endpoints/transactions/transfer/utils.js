const { reject, isNil } = require('ramda');
const { parseDate } = require('../../../utils/parseDate');

const selectFilters = ({
  sender,
  recipient,
  after,
  timeStart,
  timeEnd,
  sort,
  limit,
}) =>
  reject(isNil, {
    timeStart: timeStart && parseDate(timeStart),
    timeEnd: timeEnd && parseDate(timeEnd),
    limit,
    sort,
    recipient,
    sender,
    after,
  });

module.exports = { selectFilters };
