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
  fold: 60,
});

module.exports = { serializeCandle };
