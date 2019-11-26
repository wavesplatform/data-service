const pg = require('knex')({ client: 'pg' });

const blank = pg({ t: 'txs' }).select({
  id: 't.id',
  tx_type: 't.tx_type',
  time_stamp: 't.time_stamp',
});

module.exports = { blank };
