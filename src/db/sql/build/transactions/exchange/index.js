const F = require('./filters');

const pg = require('knex')({ client: 'pg' });

const q = pg({ t: 'txs_7' })
  .select(
    {
      // tx
      tx_id: 't.id',
      tx_time_stamp: 't.time_stamp',

      // o1
      o1_id: 'o1.id',
      o1_sender: 'o1.sender',
      o1_sender_public_key: 'o1.sender_public_key',

      // o2
      o2_id: 'o2.id',
      o2_sender: 'o2.sender',
      o2_sender_public_key: 'o2.sender_public_key',
    },
    't.amount_asset',
    't.price_asset'
  )
  .innerJoin({ o1: 'orders' }, 't.order1', 'o1.id')
  .innerJoin({ o2: 'orders' }, 't.order2', 'o2.id')
  .orderBy('t.time_stamp', 'desc')
  .limit(100);

// one — get by id
// many — apply filters
module.exports = {
  one: id => F.id(id, q).toString(),
  many: () => q.toString(),
};
