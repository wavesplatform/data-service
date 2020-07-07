const pg = require('knex')({ client: 'pg' });
const { compose, omit, keys } = require('ramda');

const columns = {
  tx_uid: 't.tx_uid',
  id: 'txs.id',
  time_stamp: 'txs.time_stamp',
  height: 't.height',
  signature: 'txs.signature',
  proofs: 'txs.proofs',

  tx_type: 'txs.tx_type',
  tx_version: 'txs.tx_version',

  sender: 'addr.address',
  sender_public_key: 'addr.public_key',

  amount_asset: pg.raw(
    "coalesce(t.order1->'assetPair'->>'amountAsset', 'WAVES')"
  ),
  price_asset: pg.raw(
    "coalesce(t.order1->'assetPair'->>'priceAsset', 'WAVES')"
  ),

  // satoshi
  price: pg.raw('t.price'),
  amount: pg.raw('t.amount'),

  fee: pg.raw('txs.fee * 10^(-8)'),
  sell_matcher_fee: pg.raw('t.sell_matcher_fee * 10^(-8)'),
  buy_matcher_fee: pg.raw('t.buy_matcher_fee * 10^(-8)'),

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
  o1_matcher_fee: pg.raw(
    "(t.order1->>'matcherFee')::double precision * 10^(-8)"
  ),
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
  o2_matcher_fee: pg.raw(
    "(t.order2->>'matcherFee')::double precision * 10^(-8)"
  ),
  o2_matcher_fee_asset_id: pg.raw("t.order2->>'matcherFeeAssetId'"),
};

const columnsFromFiltered = (filtered) =>
  filtered
    .columns([
      't.tx_uid',
      't.height',
      't.price',
      't.amount',
      't.sell_matcher_fee',
      't.buy_matcher_fee',
      't.sender_uid',
      'o1.order as order1',
      'o2.order as order2',
    ])
    .leftJoin({ o1: 'orders' }, 'o1.uid', 't.order1_uid')
    .leftJoin({ o2: 'orders' }, 'o2.uid', 't.order2_uid');

const select = pg({ t: 'txs_7' });

const selectFromFiltered = (filtered) =>
  pg
    .with('filtered_cte', columnsFromFiltered(filtered))
    .with(
      'e_cte',
      pg({ t: 'filtered_cte' })
        .columns(columns)
        .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid')
        .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
    )
    .from({ t: 'e_cte' })
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
      price: pg.raw(
        't.price * 10^(-8 - coalesce(p_dec.decimals, 8) + coalesce(a_dec.decimals, 8))'
      ),
      amount: pg.raw('t.amount * 10^(-coalesce(a_dec.decimals, 8))'),
      o1_price: pg.raw(
        't.o1_price * 10^(-8 - coalesce(p_dec.decimals, 8) + coalesce(a_dec.decimals, 8))'
      ),
      o1_amount: pg.raw('t.o1_amount * 10^(-coalesce(a_dec.decimals, 8))'),
      o2_price: pg.raw(
        't.o2_price * 10^(-8 - coalesce(p_dec.decimals, 8) + coalesce(a_dec.decimals, 8))'
      ),
      o2_amount: pg.raw('t.o2_amount * 10^(-coalesce(a_dec.decimals, 8))'),
    })
    .leftJoin({ a_dec: 'assets_data' }, 't.amount_asset', 'a_dec.asset_id')
    .leftJoin({ p_dec: 'assets_data' }, 't.price_asset', 'p_dec.asset_id');

module.exports = {
  select,
  selectFromFiltered,
};
