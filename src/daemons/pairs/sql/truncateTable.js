const knex = require('knex');
const pg = knex({ client: 'pg' });

/** truncateTable :: String -> String */
module.exports = tableName => pg.truncate(tableName).toString();
