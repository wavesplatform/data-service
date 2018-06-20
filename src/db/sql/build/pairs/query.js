const pg = require('knex')({ client: 'pg' });

const selectTxs7 = ({ priceAsset, amountAsset }, selectStatement = '*') =>
  pg({ t: 'txs_7' })
    .select(selectStatement)
    .whereRaw(
      "t.time_stamp BETWEEN timezone('utc', now() - INTERVAL '1 day') AND timezone('utc', now())"
    )
    .whereRaw("amount_asset || '/' || price_asset = ?", [
      `${amountAsset}/${priceAsset}`,
    ])
    .clone();

const volume = pair =>
  pg
    .select({ volume: pg.raw('sum(amount::double precision)') })
    .from({ t: selectTxs7(pair, 'amount') });

const price = sortDirection => pair =>
  selectTxs7(pair, 'price')
    .orderBy('time_stamp', sortDirection)
    .limit(1);

const lastPrice = price('desc');
const firstPrice = price('asc');

const volumeInPriceAsset = pair =>
  pg
    .select({
      volume_price_asset: pg.raw(
        'sum(amount :: double precision * price :: double precision * 10^(-8))'
      ),
    })
    .from({ t: selectTxs7(pair, ['amount', 'price']) });

const decimals = assetId =>
  pg('asset_decimals')
    .select('decimals')
    .where('asset_id', assetId);

const weightedAveragePrice = ({ asset1, asset2 }) =>
  pg({ t: 'txs_7' })
    .select({
      avg_price: pg.raw(
        'sum(amount :: DOUBLE PRECISION * price :: DOUBLE PRECISION) / sum(amount :: DOUBLE PRECISION)'
      ),
      amount_asset: pg.min('amount_asset'),
      price_asset: pg.min('price_asset'),
    })
    .whereRaw(
      "t.time_stamp BETWEEN timezone('utc', now() - INTERVAL '1 day') AND timezone('utc', now())"
    )
    .whereRaw(
      "(amount_asset || '/' || price_asset = ? OR amount_asset || '/' || price_asset = ?)",
      [`${asset1}/${asset2}`, `${asset2}/${asset1}`]
    )
    .clone();

module.exports = {
  volume,
  firstPrice,
  lastPrice,
  volumeInPriceAsset,
  decimals,
  weightedAveragePrice,
};
