const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs' }).select({
  tx_type: 't.tx_type',
  id: 't.id',
  time_stamp: 't.time_stamp',
  uid: 't.uid',
});

module.exports = { select };
