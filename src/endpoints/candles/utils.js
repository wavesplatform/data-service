const ONE_DAY = 1000 * 3600 * 24;

const getParamsFromQuery = ({
  interval = '1d',
  timeStart = Date.now() - ONE_DAY,
  timeEnd = Date.now(),
}) => ({
  interval,
  timeStart,
  timeEnd,
});

module.exports = { getParamsFromQuery };
