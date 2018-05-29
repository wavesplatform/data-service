const { reject, isNil } = require('ramda');
const ONE_DAY = 1000 * 3600 * 24;

const selectFilters = ({
  timeStart = new Date(Date.now() - ONE_DAY),
  timeEnd,
  matcher,
  sender,
  amountAsset,
  priceAsset,
  limit = 100,
  sort = '-timestamp',
}) =>
  reject(isNil, {
    timeStart: new Date(+timeStart),
    timeEnd: timeEnd && new Date(+timeEnd),
    limit,
    sort,
    matcher,
    sender,
    amountAsset,
    priceAsset,
  });

module.exports = { selectFilters };
