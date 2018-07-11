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
    .select({
      volume: pg.raw('sum(amount::double precision)'),
      volume_price_asset: pg.raw(
        'sum(amount :: double precision * price :: double precision * 10^(-8))'
      ),
    })
    .from({ t: selectTxs7(pair, ['amount', 'price']) });

const price = (sortDirection, alias) => pair =>
  selectTxs7(pair, { [alias]: 'price' })
    .orderBy('time_stamp', sortDirection)
    .limit(1);

const lastPrice = price('desc', 'last_price');
const firstPrice = price('asc', 'first_price');

const decimals = (alias, assetId) =>
  pg('asset_decimals')
    .select({ [alias]: 'decimals' })
    .where('asset_id', assetId);

const query = pair =>
  pg
    .select('*')
    .from({ a_dec: decimals('a_decimals', pair.amountAsset) })
    .crossJoin({ p_dec: decimals('p_decimals', pair.priceAsset) })
    .crossJoin({ fp: firstPrice(pair) })
    .crossJoin({ lp: lastPrice(pair) })
    .crossJoin({ v: volume(pair) });

const averagePriceWithWaves = asset =>
  pg({ t: 'txs_7' })
    .select({
      avg_price_with_waves: pg.raw(
        'sum(amount :: DOUBLE PRECISION * price :: DOUBLE PRECISION) / sum(amount :: DOUBLE PRECISION)'
      ),
      price_asset_with_waves: pg.min('price_asset'),
    })
    .whereRaw(
      "t.time_stamp BETWEEN timezone('utc', now() - INTERVAL '1 day') AND timezone('utc', now())"
    )
    .whereRaw(
      "(amount_asset || '/' || price_asset = ? OR amount_asset || '/' || price_asset = ?)",
      [`${asset}/WAVES`, `WAVES/${asset}`]
    )
    .clone();

module.exports = {
  query,
  queryWithWaves: pair =>
    query(pair)
      .clone()
      .crossJoin({ ww: averagePriceWithWaves(pair.priceAsset) }),
};
