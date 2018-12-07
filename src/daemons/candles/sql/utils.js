const knex = require('knex');
const pg = knex({ client: 'pg' });

// serializeCandle:: Object => Object
const serializeCandle = candle => ({
  time_start: candle.time_start,
  amount_asset_id: candle.amount_asset_id,
  price_asset_id: candle.price_asset_id,
  low: candle.low.toString(),
  high: candle.high.toString(),
  volume: candle.volume.toString(),
  price_volume: candle.price_volume.toString(),
  max_height: candle.max_height,
  txs_count: candle.txs_count.toString(),
  weighted_average_price: candle.weighted_average_price.toString(),
  open: candle.open.toString(),
  close: candle.close.toString(),
  interval_in_secs: 60,
});

const candlePresets = {
  aggregate: {
    candle_time: interval => {
      return {
        candle_time: pg.raw(
          `to_timestamp(floor((extract('epoch' from time_start) / ${interval} )) * ${interval})`
        ),
      };
    },
    low: {
      low: pg.min('low'),
    },
    high: {
      high: pg.max('high'),
    },
    volume: {
      volume: pg.sum('volume'),
    },
    price_volume: {
      price_volume: pg.sum('price_volume'),
    },
    max_height: {
      max_height: pg.max('max_height'),
    },
    txs_count: {
      txs_count: pg.sum('txs_count'),
    },
    weighted_average_price: {
      weighted_average_price: pg.raw(
        'sum(price_volume) / sum(volume)'
      ),
    },
    open: {
      open: pg.raw('(array_agg(open)::numeric[])[1]'),
    },
    close: {
      close: pg.raw(
        '(array_agg(close)::numeric[])[array_length(array_agg(close)::numeric[],1)]'
      ),
    },
    interval_in_secs: interval => {
      return {
        interval_in_secs: interval,
      };
    },
  },
};

module.exports = { serializeCandle, candlePresets };
