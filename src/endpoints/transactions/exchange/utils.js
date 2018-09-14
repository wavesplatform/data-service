const { reject, isNil } = require('ramda');
const { parseDate } = require('../../../utils/parseDate');

const selectFilters = ({
  timeStart, // No default value for timestart, other way - bad for desc pagination
  timeEnd,
  matcher,
  sender,
  amountAsset,
  priceAsset,
  limit = 100,
  sort = 'desc',
  after,
}) =>
  reject(isNil, {
    timeStart: timeStart && parseDate(timeStart),
    timeEnd: timeEnd && parseDate(timeEnd),
    limit: parseInt(limit),
    sort,
    matcher,
    sender,
    amountAsset,
    priceAsset,
    after,
  });

module.exports = { selectFilters };
