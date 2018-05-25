const ONE_DAY = 1000 * 3600 * 24;

const selectFilters = ({
  timeStart = new Date(Date.now() - ONE_DAY),
  timeEnd,
  matcher,
  sender,
  limit = 100,
  sort = '-timestamp',
}) => ({
  timeStart: new Date(+timeStart),
  timeEnd: timeEnd && new Date(+timeEnd),
  limit,
  sort,
  matcher,
  sender,
});

module.exports = { selectFilters };
