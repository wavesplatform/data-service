const { reject, isNil } = require('ramda');
const { parseDate } = require('../../../utils/parseDate');

const selectFilters = ({
  // mget
  ids,
  // search
  sender,
  recipient,
  after,
  timeStart,
  timeEnd,
  sort = 'desc',
  limit = 100,
  assetId,
}) =>
  reject(isNil, {
    ids,
    timeStart: timeStart && parseDate(timeStart),
    timeEnd: timeEnd && parseDate(timeEnd),
    limit: parseInt(limit),
    sort,
    recipient,
    sender,
    after,
    assetId,
  });

module.exports = { selectFilters };
