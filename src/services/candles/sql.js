const {
  compose,
  find,
  findLast,
  map,
  multiply,
  prop,
  sortBy,
} = require('ramda');
const Interval = require('../../types/Interval');
const { add, trunc, spreadIntervalUnits } = require('../../utils/date');
const pg = require('knex')({ client: 'pg' });

const fields = [
  'time_start',
  'amount_asset_id',
  'price_asset_id',
  'low',
  'high',
  'volume',
  'quote_volume',
  'max_height',
  'txs_count',
  'weighted_average_price',
  'open',
  'close',
  'interval_in_secs',
];

const fieldsWithDecimals = [
  ...fields,
  { a_dec: 'a_dec.decimals' },
  { p_dec: 'p_dec.decimals' },
];

/** highestDividerLessThen :: Interval i => i -> String[] -> i */
const highestDividerLessThen = (interval, dividers) =>
  compose(
    findLast(i => interval.div(i) >= 1),
    sortBy(prop('length')),
    map(Interval)
  )(dividers);

/** selectCandles :: { amountAsset: String, priceAsset: String, timeStart: Date, timeEnd: Date, interval: String } -> knex.QueryBuilder */
const selectCandles = ({
  amountAsset,
  priceAsset,
  timeStart,
  timeEnd,
  interval,
}) =>
  pg('candles')
    .select(fields)
    .where('amount_asset_id', amountAsset)
    .where('price_asset_id', priceAsset)
    .where('time_start', '>=', timeStart)
    .where('time_start', '<=', timeEnd)
    .where(
      'interval_in_secs',
      highestDividerLessThen(Interval(interval), [
        '1m',
        '5m',
        '15m',
        '30m',
        '1h',
        '3h',
        '6h',
        '12h',
        '1d',
      ]).length / 1000
    );

/** periodToQueries :: { timeStart: Date, period: String } -> [knex.QueryBuilder] */
const periodToQueries = ({
  amountAsset,
  priceAsset,
  timeStart,
  period,
  dividers,
}) => {
  const queries = [];

  let interval = Interval(period);

  let itTimestamp = new Date(trunc('minutes', timeStart)).getTime();
  const endTimestamp = new Date(
    trunc('minutes', add(interval, timeStart))
  ).getTime();

  while (itTimestamp < endTimestamp) {
    const theBiggestInterval = compose(
      find(i => interval.div(i) >= 1),
      sortBy(
        compose(
          multiply(-1),
          prop('length')
        )
      ), // desc sorting
      map(Interval)
    )(dividers);

    const timeEnd = add(theBiggestInterval, new Date(itTimestamp));

    queries.push(
      selectCandles({
        amountAsset,
        priceAsset,
        timeStart: new Date(itTimestamp),
        timeEnd: timeEnd,
        interval: theBiggestInterval.toString(),
      })
    );

    itTimestamp = timeEnd.getTime();
    interval = Interval.fromNumber(
      interval.length - theBiggestInterval.length
    ).getOrElse(null);

    if (interval === null) {
      break;
    }
  }

  return queries;
};

/** sql :: { String, String, { timeStart: Date, timeEnd: Date, interval: String } } -> String */
const sql = ({ amountAsset, priceAsset, params }) => {
  const ts = new Date(
    trunc(spreadIntervalUnits(params.interval), params.timeEnd)
  );

  const te = new Date(trunc('minutes', params.timeEnd));

  const p = Interval.fromNumber(te.getTime() - ts.getTime())
    .getOrElse('')
    .toString();

  return pg('candles')
    .select(fieldsWithDecimals)
    .from(
      selectCandles({
        amountAsset,
        priceAsset,
        timeStart: params.timeStart,
        timeEnd: params.timeEnd,
        interval: params.interval,
      })
        .union(
          periodToQueries({
            amountAsset: amountAsset,
            priceAsset: priceAsset,
            timeStart: ts,
            period: p,
            dividers: ['1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1d'],
          })
        )
        .as('c')
    )
    .innerJoin(
      { a_dec: 'asset_decimals' },
      'c.amount_asset_id',
      'a_dec.asset_id'
    )
    .innerJoin(
      { p_dec: 'asset_decimals' },
      'c.price_asset_id',
      'p_dec.asset_id'
    )
    .orderBy('c.time_start', 'asc')
    .toString();
};

/** sql :: String -> String */
const assetDecimals = asset =>
  pg('asset_decimals')
    .select('decimals')
    .where('asset_id', asset)
    .toString();

module.exports = {
  highestDividerLessThen,
  assetDecimals,
  sql,
};
