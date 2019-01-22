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
];

const mget = ids =>
  pg('assets')
    .select(columns)
    .whereIn('asset_id', ids)
    .toString();

module.exports = {
  get: id => mget([id]),
  mget,
  search: ({ ticker }) => {
    const filter = q => {
      if (ticker === '*') return q.whereNotNull('ticker');
      else return q.where('ticker', ticker);
    };

    return compose(
      q => q.toString(),
      filter
    )(pg('assets').select(columns));
  },
};
