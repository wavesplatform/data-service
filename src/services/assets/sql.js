const pg = require('knex')({ client: 'pg' });
const { compose } = require('ramda');

const mget = ids =>
  pg('assets')
    .select('*')
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
    )(pg('assets').select('*'));
  },
};
