const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs' }).select({
  tx_uid: 't.uid',
  id: 't.id',
  tx_type: 't.tx_type',
  time_stamp: 't.time_stamp',
});

module.exports = { select };
