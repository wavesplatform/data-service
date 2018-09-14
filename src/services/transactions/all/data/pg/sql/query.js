const pg = require('knex')({ client: 'pg' });
const select = pg({ t: 'txs_raw' }).select('*');

module.exports = select;
