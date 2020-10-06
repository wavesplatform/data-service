const pg = require('knex')({ client: 'pg' });

const columns = {
  tx_uid: 't.tx_uid',
  id: 'txs.id',
  time_stamp: 'txs.time_stamp',
  height: 't.height',
  signature: 'txs.signature',
  proofs: 'txs.proofs',
  tx_type: 'txs.tx_type',
  tx_version: 'txs.tx_version',
  status: 'txs.status',

  sender: 't.sender',
  sender_public_key: 't.sender_public_key',

  amount_asset: 't.amount_asset_id',
  price_asset: 't.price_asset_id',

  // satoshi
  price: 't.price',
  amount: 't.amount',

  fee: 'txs.fee',
  sell_matcher_fee: 't.sell_matcher_fee',
  buy_matcher_fee: 't.buy_matcher_fee',

  o1_id: pg.raw("t.order1->>'id'"),
  o1_version: pg.raw("t.order1->>'version'"),
  o1_time_stamp: pg.raw("text_timestamp_cast(t.order1->>'timestamp')"),
  o1_expiration: pg.raw("text_timestamp_cast(t.order1->>'expiration')"),
  o1_signature: pg.raw("t.order1->>'signature'"),
  o1_sender: pg.raw("t.order1->>'sender'"),
  o1_sender_public_key: pg.raw("t.order1->>'senderPublicKey'"),
  o1_type: pg.raw("t.order1->>'orderType'"),
  o1_price: pg.raw("(t.order1->>'price')::double precision"),
  o1_amount: pg.raw("(t.order1->>'amount')::double precision"),
  o1_matcher_fee: pg.raw("(t.order1->>'matcherFee')::double precision"),
  o1_matcher_fee_asset_id: pg.raw("t.order1->>'matcherFeeAssetId'"),

  o2_id: pg.raw("t.order2->>'id'"),
  o2_version: pg.raw("t.order2->>'version'"),
  o2_time_stamp: pg.raw("text_timestamp_cast(t.order2->>'timestamp')"),
  o2_expiration: pg.raw("text_timestamp_cast(t.order2->>'expiration')"),
  o2_signature: pg.raw("t.order2->>'signature'"),
  o2_sender: pg.raw("t.order2->>'sender'"),
  o2_sender_public_key: pg.raw("t.order2->>'senderPublicKey'"),
  o2_type: pg.raw("t.order2->>'orderType'"),
  o2_price: pg.raw("(t.order2->>'price')::double precision"),
  o2_amount: pg.raw("(t.order2->>'amount')::double precision"),
  o2_matcher_fee: pg.raw("(t.order2->>'matcherFee')::double precision"),
  o2_matcher_fee_asset_id: pg.raw("t.order2->>'matcherFeeAssetId'"),
};

const select = pg({ t: 'txs_7' }).columns([
  't.tx_uid',
  't.height',
  't.price',
  't.amount',
  't.sell_matcher_fee',
  't.buy_matcher_fee',
  't.sender',
  't.sender_public_key',
  't.order1',
  't.order2',
  't.amount_asset_id',
  't.price_asset_id',
]);

const selectFromFiltered = (filtered) =>
  pg
    .from({ t: filtered })
    .columns(columns)
    .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid');

module.exports = {
  select,
  selectFromFiltered,
};
