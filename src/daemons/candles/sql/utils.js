const knex = require('knex');
const pg = knex({ client: 'pg' });

// serializeCandle:: Object => Object
const serializeCandle = candle => ({
  time_start: candle.time_start,
  amount_asset_id: candle.amount_asset_id,
  price_asset_id: candle.price_asset_id,
  matcher: candle.matcher,
  low: candle.low.toString(),
  high: candle.high.toString(),
  volume: candle.volume.toString(),
  quote_volume: candle.quote_volume.toString(),
  max_height: candle.max_height,
  txs_count: candle.txs_count.toString(),
  weighted_average_price: candle.weighted_average_price.toString(),
  open: candle.open.toString(),
  close: candle.close.toString(),
  interval_in_secs: 60,
});

const candlePresets = {
  aggregate: {
    candle_time: interval =>
      pg.raw(
        `to_timestamp(floor((extract('epoch' from time_start) / ${interval} )) * ${interval})`
      ),
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

module.exports = { serializeCandle, candlePresets };
