const knex = require('knex');
const pg = knex({ client: 'pg' });

const { CandleInterval } = require('../../../types');

/**
 *
 * @param {string} from
 */
const pgRawExtractFromToTimestamp = from => /** @param {string} interval */ interval =>
  pg.raw(
    `to_timestamp(floor((extract('epoch' from ${from}) / ${interval} )) * ${interval})`
  );

/**
 *
 * @param {string} from
 */
const pgRawDateTrunc = from => /** @param {string} interval */ interval =>
  pg.raw(`date_trunc('${interval}', ${from})`);

/**
 *
 * @param {string} from
 * @param {keyof CandleInterval} interval
 */
const toRawTimestamp = (from, interval) => {
  const nf = pgRawExtractFromToTimestamp(from);
  const sf = pgRawDateTrunc(from);

  switch (interval) {
    case CandleInterval.Minute1:
      return nf(60);
    case CandleInterval.Minute5:
      return nf(300);
    case CandleInterval.Minute15:
      return nf(900);
    case CandleInterval.Minute30:
      return nf(1800);
    case CandleInterval.Hour1:
      return nf(3600);
    case CandleInterval.Hour2:
      return nf(7200);
    case CandleInterval.Hour3:
      return nf(10800);
    case CandleInterval.Hour4:
      return nf(14400);
    case CandleInterval.Hour6:
      return nf(21600);
    case CandleInterval.Hour12:
      return nf(43200);
    case CandleInterval.Day1:
      return nf(86400);
    case CandleInterval.Week1:
      return sf('week');
    case CandleInterval.Month1:
      return sf('month');
  }
};

/**
 * @param {Date | string} timestamp
 * @param {string} interval
 */
const makeRawTimestamp = (timestamp, interval) => {
  const ts =
    timestamp instanceof Date
      ? `'${timestamp.toISOString()}'::timestamp`
      : timestamp;

  return toRawTimestamp(ts, interval);
};

// serializeCandle:: Object => Object
// @todo refactor after pg updating for work with BigInt instead of BigNumber
const serializeCandle = candle => ({
  time_start: candle.time_start,
  amount_asset_uid: candle.amount_asset_uid.toString(), // uid is bigint (BigNumber)
  price_asset_uid: candle.price_asset_uid.toString(), // uid is bigint (BigNumber)
  matcher_address_uid: candle.matcher_address_uid.toString(), // uid is bigint (BigNumber)
  low: candle.low.toString(),
  high: candle.high.toString(),
  volume: candle.volume.toString(),
  quote_volume: candle.quote_volume.toString(),
  max_height: candle.max_height,
  txs_count: candle.txs_count.toString(),
  weighted_average_price: candle.weighted_average_price.toString(),
  open: candle.open.toString(),
  close: candle.close.toString(),
  interval: CandleInterval.Minute1,
});

const candlePresets = {
  aggregate: {
    candle_time: interval => toRawTimestamp('time_start', interval),
    low: pg.min('low'),
    high: pg.max('high'),
    volume: pg.sum('volume'),
    quote_volume: pg.sum('quote_volume'),
    max_height: pg.max('max_height'),
    txs_count: pg.sum('txs_count'),
    weighted_average_price: pg.raw(
      '(sum((weighted_average_price * volume)::numeric)::numeric / sum(volume)::numeric)::numeric'
    ),
    open: pg.raw('(array_agg(open ORDER BY time_start)::numeric[])[1]'),
    close: pg.raw('(array_agg(close ORDER BY time_start DESC)::numeric[])[1]'),
  },
};

module.exports = {
  pgRawDateTrunc,
  makeRawTimestamp,
  serializeCandle,
  candlePresets,
};
