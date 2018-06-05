const { reject, isNil } = require('ramda');
const ONE_DAY = 1000 * 3600 * 24;
const { parseDate } = require('../../../utils/parseDate');

const selectFilters = ({
  timeStart = `${new Date(Date.now() - ONE_DAY)}`,
  timeEnd,
  matcher,
  sender,
  amountAsset,
  priceAsset,
  limit = 100,
  sort = '-timestamp',
}) =>
  reject(isNil, {
    timeStart: parseDate(timeStart),
    timeEnd: timeEnd && parseDate(timeEnd),
    limit,
    sort,
    matcher,
    sender,
    amountAsset,
    priceAsset,
  });

module.exports = { selectFilters };
