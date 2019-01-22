const pg = require('knex')({ client: 'pg' });

module.exports = ids =>
  pg('assets')
    .select([
      'asset_id',
      'asset_name',
      'description',
      'sender',
      'issue_height',
      'total_quantity',
      'decimals',
      'reissuable',
      'ticker',
      'issue_timestamp'
    ])
    .whereIn('asset_id', ids)
    .toString();
