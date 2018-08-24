const { reject, isNil } = require('ramda');
const { parseDate } = require('../../../utils/parseDate');

const selectFilters = ({
  sender,
  after,
  assetId,
  timeStart,
  timeEnd,
  sort,
  limit = 100,
  recipient,
}) =>
  reject(isNil, {
    timeStart: timeStart && parseDate(timeStart),
    timeEnd: timeEnd && parseDate(timeEnd),
    limit,
    sort,
    sender,
    after,
    assetId,
    recipient,
  });

module.exports = { selectFilters };
