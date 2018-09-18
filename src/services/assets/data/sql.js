const pg = require('knex')({ client: 'pg' });

module.exports = ids =>
  pg('assets')
    .select('*')
    .whereIn('asset_id', ids)
    .toString();
