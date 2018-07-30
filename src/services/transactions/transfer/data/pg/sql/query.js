const pg = require('knex')({ client: 'pg' });
const select = pg({ t: 'txs_4' }).select('*');

module.exports = select;
