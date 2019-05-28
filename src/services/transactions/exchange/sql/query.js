const pg = require('knex')({ client: 'pg' });

const { compose, omit, keys } = require('ramda');

const columns = {
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

  // satoshi
  price: pg.raw('t.price'),
  amount: pg.raw('t.amount'),

  fee: pg.raw('t.fee * 10^(-8)'),
  sell_matcher_fee: pg.raw('t.sell_matcher_fee * 10^(-8)'),
  buy_matcher_fee: pg.raw('t.buy_matcher_fee * 10^(-8)'),

  o1_id: pg.raw("order1->>'id'"),
  o1_version: pg.raw("order1->>'version'"),
  o1_time_stamp: pg.raw("text_timestamp_cast(order1->>'timestamp')"),
  o1_expiration: pg.raw("text_timestamp_cast(order1->>'expiration')"),
  o1_signature: pg.raw("order1->>'signature'"),
  o1_sender: pg.raw("order1->>'sender'"),
  o1_sender_public_key: pg.raw("order1->>'senderPublicKey'"),
  o1_type: pg.raw("order1->>'orderType'"),
  o1_price: pg.raw("(order1->>'price')::double precision"),
  o1_amount: pg.raw("(order1->>'amount')::double precision"),
  o1_matcher_fee: pg.raw("(order1->>'matcherFee')::double precision * 10^(-8)"),
  o1_matcher_fee_asset_id: pg.raw("order1->>'matcherFeeAssetId'"),

  o2_id: pg.raw("order2->>'id'"),
  o2_version: pg.raw("order2->>'version'"),
  o2_time_stamp: pg.raw("text_timestamp_cast(order2->>'timestamp')"),
  o2_expiration: pg.raw("text_timestamp_cast(order2->>'expiration')"),
  o2_signature: pg.raw("order2->>'signature'"),
  o2_sender: pg.raw("order2->>'sender'"),
  o2_sender_public_key: pg.raw("order2->>'senderPublicKey'"),
  o2_type: pg.raw("order2->>'orderType'"),
  o2_price: pg.raw("(order2->>'price')::double precision"),
  o2_amount: pg.raw("(order2->>'amount')::double precision"),
  o2_matcher_fee: pg.raw("(order2->>'matcherFee')::double precision * 10^(-8)"),
  o2_matcher_fee_asset_id: pg.raw("order2->>'matcherFeeAssetId'"),
};

const select = pg({ t: 'txs_7' }).select(columns);

const withDecimals = q =>
  pg({ t: q })
    .columns(
      compose(
        keys,
        omit([
          'price',
          'amount',
          'o1_price',
          'o1_amount',
          'o2_price',
          'o2_amount',
        ])
      )(columns)
    )
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
    .innerJoin({ a_dec: 'asset_decimals' }, 't.amount_asset', 'a_dec.asset_id')
    .innerJoin({ p_dec: 'asset_decimals' }, 't.price_asset', 'p_dec.asset_id');

module.exports = {
  select,
  withDecimals,
};
