const F = require('./filters');

const pg = require('knex')({ client: 'pg' });

// @todo — support `proofs` as well as `signature`
const q = pg({ t: 'txs_7' })
  .select({
    // tx
    tx_id: 't.id',
    tx_time_stamp: 't.time_stamp',
    tx_height: 't.height',
    tx_signature: 't.signature',

    tx_sender: 't.sender',
    tx_sender_public_key: 't.sender_public_key',

    tx_amount_asset: 't.amount_asset',
    tx_price_asset: 't.price_asset',

    tx_price: pg.raw('t.price * 10^(-8 - p_dec.decimals + a_dec.decimals)'),
    tx_amount: pg.raw('t.amount * 10^(-a_dec.decimals)'),

    tx_fee: 't.fee',
    tx_sell_matcher_fee: 't.sell_matcher_fee',
    tx_buy_matcher_fee: 't.buy_matcher_fee',

    // o1
    o1_id: 'o1.id',
    o1_time_stamp: 'o1.time_stamp',
    o1_expiration: 'o1.expiration',
    o1_signature: 'o1.signature',
    o1_sender: 'o1.sender',
    o1_sender_public_key: 'o1.sender_public_key',
    o1_type: 'o1.order_type',
    o1_price: pg.raw('o1.price * 10^(-8 - p_dec.decimals + a_dec.decimals)'),
    o1_amount: pg.raw('o1.amount * 10^(-a_dec.decimals)'),
    o1_matcher_fee: 'o1.matcher_fee',

    // o2
    o2_id: 'o2.id',
    o2_time_stamp: 'o2.time_stamp',
    o2_expiration: 'o2.expiration',
    o2_signature: 'o2.signature',
    o2_sender: 'o2.sender',
    o2_sender_public_key: 'o2.sender_public_key',
    o2_type: 'o2.order_type',
    o2_price: pg.raw('o2.price * 10^(-8 - p_dec.decimals + a_dec.decimals)'),
    o2_amount: pg.raw('o2.amount * 10^(-a_dec.decimals)'),
    o2_matcher_fee: 'o2.matcher_fee',
  })
  .innerJoin({ o1: 'orders' }, 't.order1', 'o1.id')
  .innerJoin({ o2: 'orders' }, 't.order2', 'o2.id')
  // to get decimals
  .innerJoin({ a_dec: 'asset_decimals' }, 't.amount_asset', 'a_dec.asset_id')
  .innerJoin({ p_dec: 'asset_decimals' }, 't.price_asset', 'p_dec.asset_id')
  .orderBy('t.time_stamp', 'desc')
  .limit(100);

// one — get by id
// many — apply filters
module.exports = {
  one: id => F.id(id, q).toString(),
  many: () => q.toString(),
};
