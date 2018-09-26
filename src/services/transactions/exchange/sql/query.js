const pg = require('knex')({ client: 'pg' });

const { compose, keys, omit } = require('ramda');

const selectFields = [
  't.id',
  't.time_stamp',
  't.height',
  't.signature',
  't.proofs',
  't.tx_type',
  't.tx_version',

  't.sender',
  't.sender_public_key',

  't.amount_asset',
  't.price_asset',
  't.price',
  't.amount',

  't.fee',
  't.sell_matcher_fee',
  't.buy_matcher_fee',

  't.order1',
  't.order2',
];
// @todo — support 'proofs' as well as 'signature'
const select = pg({ t: 'txs_7' }).select(selectFields);

const orderFields = {
  o1_id: 'o1.id',
  o1_time_stamp: 'o1.time_stamp',
  o1_expiration: 'o1.expiration',
  o1_signature: 'o1.signature',
  o1_sender: 'o1.sender',
  o1_sender_public_key: 'o1.sender_public_key',
  o1_type: 'o1.order_type',
  o1_price: 'o1.price',
  o1_amount: 'o1.amount',
  o1_matcher_fee: pg.raw('o1.matcher_fee * 10^(-8)'),

  // o2
  o2_id: 'o2.id',
  o2_time_stamp: 'o2.time_stamp',
  o2_expiration: 'o2.expiration',
  o2_signature: 'o2.signature',
  o2_sender: 'o2.sender',
  o2_sender_public_key: 'o2.sender_public_key',
  o2_type: 'o2.order_type',
  o2_price: 'o2.price',
  o2_amount: 'o2.amount',
  o2_matcher_fee: pg.raw('o2.matcher_fee * 10^(-8)'),
};
/**
 * Adds orders to query
 * @param {Query} q
 */
const withOrders = q => {
  return pg({ t: q })
    .columns(selectFields)
    .columns(orderFields)
    .select()
    .innerJoin({ o1: 'orders' }, 't.order1', 'o1.id')
    .innerJoin({ o2: 'orders' }, 't.order2', 'o2.id');
};

const renameMap = {
  id: 't.id',
  time_stamp: 't.time_stamp',
  height: 't.height',
  signature: 't.signature',
  proofs: 't.proofs',

  tx_type: 't.tx_type',
  tx_version: 't.tx_version',

  sender: 't.sender',
  sender_public_key: 't.sender_public_key',

  amount_asset: 't.amount_asset',
  price_asset: 't.price_asset',

  price: 't.price',
  amount: 't.amount',

  fee: pg.raw('t.fee * 10^(-8)'),
  sell_matcher_fee: pg.raw('t.sell_matcher_fee * 10^(-8)'),
  buy_matcher_fee: pg.raw('t.buy_matcher_fee * 10^(-8)'),

  // o1
  o1_id: 'o1_id',
  o1_time_stamp: 'o1_time_stamp',
  o1_expiration: 'o1_expiration',
  o1_signature: 'o1_signature',
  o1_sender: 'o1_sender',
  o1_sender_public_key: 'o1_sender_public_key',
  o1_type: 'o1_type',
  o1_price: 'o1_price',
  o1_amount: 'o1_amount',
  o1_matcher_fee: 'o1_matcher_fee',

  // o2
  o2_id: 'o2_id',
  o2_time_stamp: 'o2_time_stamp',
  o2_expiration: 'o2_expiration',
  o2_signature: 'o2_signature',
  o2_sender: 'o2_sender',
  o2_sender_public_key: 'o2_sender_public_key',
  o2_type: 'o2_type',
  o2_price: 'o2_price',
  o2_amount: 'o2_amount',
  o2_matcher_fee: 'o2_matcher_fee',
};
/**
 * Renames fields according
 * to output validation schema
 * @param {Query} q
 */
const renameFields = q => pg({ t: q }).select(renameMap);

/**
 * Removes fields for decimal's
 * calculation and adds decimals fields
 * for both orders
 * @param {Query} q
 */
const withDecimals = q => {
  const fieldsExceptSatoshi = compose(
    keys,
    omit(['price', 'amount', 'o1_price', 'o1_amount', 'o2_price', 'o2_amount'])
  )(renameMap);

  return (
    pg({ t: q })
      .columns(fieldsExceptSatoshi)
      .columns({
        price: pg.raw('t.price * 10^(-8 - p_dec.decimals + a_dec.decimals)'),
        amount: pg.raw('t.amount * 10^(-a_dec.decimals)'),
        o1_price: pg.raw(
          't.o1_price * 10^(-8 - p_dec.decimals + a_dec.decimals)'
        ),
        o1_amount: pg.raw('t.o1_amount * 10^(-a_dec.decimals)'),
        o2_price: pg.raw(
          't.o2_price * 10^(-8 - p_dec.decimals + a_dec.decimals)'
        ),
        o2_amount: pg.raw('t.o2_amount * 10^(-a_dec.decimals)'),
      })
      .select()
      // to get decimals
      .innerJoin(
        { a_dec: 'asset_decimals' },
        't.amount_asset',
        'a_dec.asset_id'
      )
      .innerJoin({ p_dec: 'asset_decimals' }, 't.price_asset', 'p_dec.asset_id')
  );
};

module.exports = {
  select,
  renameFields,
  withDecimals,
  withOrders,
};
