const pg = require('knex')({ client: 'pg' });
const { compose } = require('ramda');

const columns = [
  'asset_id',
  'asset_name',
  'description',
  'sender',
  'issue_height',
  'total_quantity',
  'decimals',
  'reissuable',
  'ticker',
  'issue_timestamp',
  'has_script',
  'min_sponsored_asset_fee',
];

const searchById = q =>
  pg({ t: 'txs_3' })
    .columns({
      asset_id: 't.asset_id',
      asset_name: 't.asset_name',
      ticker: 'ti.ticker',
      height: 't.height',
      rank: pg.raw(
        `ts_rank(to_tsvector('simple', t.asset_id), to_tsquery('${q
          .split(' ')
          .join(
            ' & '
          )}:*'), 3) * case when ti.ticker is null then 128 else 256 end`
      ),
    })
    .leftJoin({ ti: 'tickers' }, 't.asset_id', 'ti.asset_id')
    .where('t.asset_id', q);

const searchByNameInMeta = q =>
  pg
    .columns([
      'asset_id',
      'asset_name',
      'ticker',
      'height',
      {
        rank: pg.raw(
          `ts_rank(to_tsvector('simple', asset_name), to_tsquery('${q}:*'), 3) * case when ticker is null then 64 else 128 end`
        ),
      },
    ])
    .from('assets_metadata')
    .where('asset_name', 'like', `${q}%`);

const searchByTicker = q =>
  pg({ ti: 'tickers' })
    .columns({
      asset_id: 'ti.asset_id',
      asset_name: 't.asset_name',
      ticker: 'ti.ticker',
      height: 't.height',
      rank: pg.raw(
        `ts_rank(to_tsvector('simple', ti.ticker), to_tsquery('${q
          .split(' ')
          .join(' & ')}:*'), 3) * 32`
      ),
    })
    .leftJoin({ t: 'txs_3' }, 'ti.asset_id', 't.asset_id')
    .where('ticker', 'like', `${q}%`);

const searchByName = q =>
  pg({ t: 'txs_3' })
    .columns({
      asset_id: 't.asset_id',
      asset_name: 't.asset_name',
      ticker: 'ti.ticker',
      height: 't.height',
      rank: pg.raw(
        `ts_rank(searchable_asset_name, to_tsquery('${q
          .split(' ')
          .join(
            ' & '
          )}:*'), 3) * case when ti.ticker is null then 16 else 32 end`
      ),
    })
    .leftJoin({ ti: 'tickers' }, 't.asset_id', 'ti.asset_id')
    .whereRaw(
      `searchable_asset_name @@ to_tsquery('${q.split(' ').join(' & ')}:*')`
    );

const getAssetIndex = asset_id =>
  pg('assets_cte')
    .column('rn')
    .where('asset_id', asset_id);

const searchAssets = query =>
  pg
    .with('assets_cte', qb => {
      qb.columns([
        'asset_id',
        'ticker',
        'asset_name',
        {
          rn: pg.raw(
            'row_number() over (order by r.rank desc, r.height asc, r.asset_id asc)'
          ),
        },
      ]).from({
        r: searchById(query)
          .unionAll(searchByNameInMeta(query))
          .unionAll(searchByTicker(query))
          .unionAll(searchByName(query)),
      });
    })
    .from('assets_cte')
    .select(columns.map(col => 'a.' + col))
    .innerJoin({ a: 'assets' }, 'assets_cte.asset_id', 'a.asset_id')
    .orderBy('rn', 'asc');

const mget = ids =>
  pg('assets')
    .select(columns)
    .whereIn('asset_id', ids)
    .toString();

module.exports = {
  get: id => mget([id]),
  mget,
  search: ({ ticker, phrase, params: { after, limit } }) => {
    const filter = q => {
      if (ticker === '*') return q.whereNotNull('ticker');
      else return q.where('ticker', ticker);
    };

    if (typeof ticker !== 'undefined') {
      return compose(
        q => q.toString(),
        filter
      )(pg('assets').select(columns));
    } else if (typeof phrase !== 'undefined') {
      return compose(
        q => q.toString(),
        q => (limit ? q.clone().limit(limit) : q),
        q => (after ? q.clone().where('rn', '>', getAssetIndex(after)) : q),
        searchAssets
      )(phrase);
    }
  },
};
