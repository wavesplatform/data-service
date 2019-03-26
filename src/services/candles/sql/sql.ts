import { Interval } from '../../../types';

const {
  compose,
  find,
  findLast,
  map,
  multiply,
  prop,
  sortBy,
} = require('ramda');
const { interval, Unit } = require('../../types');
const {
  div,
  fromMillisecs: intervalFromMillisecs,
} = require('../../utils/interval');
const { add, trunc } = require('../../utils/date');
const pg = require('knex')({ client: 'pg' });

const FIELDS = [
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

const FIELDS_WITH_DECIMALS = [
  ...FIELDS,
  { a_dec: 'a_dec.decimals' },
  { p_dec: 'p_dec.decimals' },
];

const DIVIDERS = ['1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1d'];

/** highestDividerLessThan :: Interval i => (Interval i, String[]) -> i */
export const highestDividerLessThan = (inter: Interval, dividers: string[]) =>
  compose(
    findLast(i => div(inter, i) >= 1),
    sortBy(prop('length')),
    map(d => interval(d).getOrElse(null))
  )(dividers);

/** selectCandles :: { amountAsset: String, priceAsset: String, timeStart: Date, timeEnd: Date, interval: String } -> knex.QueryBuilder */
export const selectCandles = ({
  amountAsset,
  priceAsset,
  timeStart,
  timeEnd,
  interval: inter,
}: {
  amountAsset: string;
  priceAsset: string;
  timeStart: Date;
  timeEnd: Date;
  interval: string;
}) =>
  pg('candles')
    .select(FIELDS)
    .where('amount_asset_id', amountAsset)
    .where('price_asset_id', priceAsset)
    .where('time_start', '>=', timeStart)
    .where('time_start', '<=', timeEnd)
    .where(
      'interval_in_secs',
      highestDividerLessThan(interval(inter).getOrElse(null), DIVIDERS).length /
        1000
    );

// @todo test
/**
 * Composes sum using a polynom with additives from given units array
 * Uses a greedy algorithm
 * @param sum
 * @param units is sorted asc
 */
export const numberToUnitsPolynom = (
  units: number[],
  sum: number
): number[][] => {
  const [_, result] = units.reduce<[number, number[][]]>(
    ([remaining, result], unit) => {
      const k = Math.floor(remaining / unit);
      if (k > 0) {
        return [remaining - k * unit, [...result, [unit, k]]];
      } else {
        return [remaining, result];
      }
    },
    [sum, [[]]]
  );
  return result;
};

// @todo refactor
/** periodToQueries :: { amountAsset: String, priceAsset: String, timeStart: Date, period: String, dividers: [String] } -> [knex.QueryBuilder] */
export const periodToQueries = ({
  amountAsset,
  priceAsset,
  timeStart,
  period,
  dividers,
}) => {
  const queries = [];

  let periodInterval = interval(period).unsafeGet();

  let itTimestamp = new Date(trunc(Unit.Minute, timeStart)).getTime();
  const endTimestamp = new Date(
    trunc(Unit.Minute, add(periodInterval, timeStart))
  ).getTime();

  while (itTimestamp < endTimestamp) {
    const theBiggestInterval = compose(
      find(i => div(periodInterval, i) >= 1),
      sortBy(
        compose(
          multiply(-1),
          prop('length')
        )
      ), // desc sorting
      map(d => interval(d).getOrElse(null))
    )(dividers);

    if (!theBiggestInterval) {
      break;
    }

    const timeEnd = add(theBiggestInterval, new Date(itTimestamp));

    queries.push(
      selectCandles({
        amountAsset,
        priceAsset,
        timeStart: new Date(itTimestamp),
        timeEnd: timeEnd,
        interval: theBiggestInterval.source,
      })
    );

    itTimestamp = timeEnd.getTime();
    periodInterval = intervalFromMillisecs(
      periodInterval.length - theBiggestInterval.length
    ).getOrElse(null);

    if (periodInterval === null) {
      break;
    }
  }

  return queries;
};

/** sql :: { String, String, { timeStart: Date, timeEnd: Date, interval: String } } -> String */
export const sql = ({ amountAsset, priceAsset, params }) => {
  // should always be valid after validation
  const paramsInterval = interval(params.interval).unsafeGet();

  const p = interval(params.interval)
    .chain(i => {
      const ts = new Date(trunc(i.unit, params.timeEnd));
      const te = new Date(trunc(Unit.Minute, params.timeEnd));
      return intervalFromMillisecs(te - ts);
    })
    .map(i => i.source);

  return pg('candles')
    .select(FIELDS_WITH_DECIMALS)
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
export const assetDecimals = asset =>
  pg('asset_decimals')
    .select('decimals')
    .where('asset_id', asset)
    .toString();

module.exports = {
  highestDividerLessThan,
  assetDecimals,
  periodToQueries,
  sql,
};
