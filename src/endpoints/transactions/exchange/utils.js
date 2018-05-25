const ONE_DAY = 1000 * 3600 * 24;

const selectFilters = ({
  timeStart = new Date(Date.now() - ONE_DAY),
  timeEnd = new Date(),
  matcher,
  sender,
  limit = 100,
  sort = '+id',
}) => ({
  timeStart: new Date(+timeStart),
  timeEnd: new Date(+timeEnd),
  limit,
  sort,
  matcher,
  sender,
});

module.exports = { selectFilters };
