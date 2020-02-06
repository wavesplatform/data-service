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
    "coalesce(o1.order->'assetPair'->>'amountAsset', 'WAVES')"
  ),
  price_asset: pg.raw(
    "coalesce(o1.order->'assetPair'->>'priceAsset', 'WAVES')"
  ),

  // satoshi
  price: pg.raw('t.price'),
  amount: pg.raw('t.amount'),

  fee: pg.raw('txs.fee * 10^(-8)'),
  sell_matcher_fee: pg.raw('t.sell_matcher_fee * 10^(-8)'),
  buy_matcher_fee: pg.raw('t.buy_matcher_fee * 10^(-8)'),

  o1_id: pg.raw("o1.order->>'id'"),
  o1_version: pg.raw("o1.order->>'version'"),
  o1_time_stamp: pg.raw("text_timestamp_cast(o1.order->>'timestamp')"),
  o1_expiration: pg.raw("text_timestamp_cast(o1.order->>'expiration')"),
  o1_signature: pg.raw("o1.order->>'signature'"),
  o1_sender: pg.raw("o1.order->>'sender'"),
  o1_sender_public_key: pg.raw("o1.order->>'senderPublicKey'"),
  o1_type: pg.raw("o1.order->>'orderType'"),
  o1_price: pg.raw("(o1.order->>'price')::double precision"),
  o1_amount: pg.raw("(o1.order->>'amount')::double precision"),
  o1_matcher_fee: pg.raw(
    "(o1.order->>'matcherFee')::double precision * 10^(-8)"
  ),
  o1_matcher_fee_asset_id: pg.raw("o1.order->>'matcherFeeAssetId'"),

  o2_id: pg.raw("o2.order->>'id'"),
  o2_version: pg.raw("o2.order->>'version'"),
  o2_time_stamp: pg.raw("text_timestamp_cast(o2.order->>'timestamp')"),
  o2_expiration: pg.raw("text_timestamp_cast(o2.order->>'expiration')"),
  o2_signature: pg.raw("o2.order->>'signature'"),
  o2_sender: pg.raw("o2.order->>'sender'"),
  o2_sender_public_key: pg.raw("o2.order->>'senderPublicKey'"),
  o2_type: pg.raw("o2.order->>'orderType'"),
  o2_price: pg.raw("(o2.order->>'price')::double precision"),
  o2_amount: pg.raw("(o2.order->>'amount')::double precision"),
  o2_matcher_fee: pg.raw(
    "(o2.order->>'matcherFee')::double precision * 10^(-8)"
  ),
  o2_matcher_fee_asset_id: pg.raw("o2.order->>'matcherFeeAssetId'"),
};

// filters would be applied on this
const select = pg({ t: 'txs_7_orders' }).select('t.tx_uid');

const selectFromFiltered = filtered =>
  pg
    .with(
      'filtered_cte',
      filtered
        .columns([
          'e.height',
          'e.price',
          'e.amount',
          'e.sell_matcher_fee',
          'e.buy_matcher_fee',
          'e.sender_uid',
          'e.order1_uid',
          'e.order2_uid',
        ])
        .join({ e: 'txs_7' }, function() {
          this.on('e.tx_uid', 't.tx_uid').andOn(function() {
            this.on('e.order1_uid', 't.order_uid').orOn(
              'e.order2_uid',
              't.order_uid'
            );
          });
        })
        .limit(1)
    )
    .with(
      'e_cte',
      pg({ t: 'filtered_cte' })
        .columns(columns)
        .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid')
        .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
        .leftJoin({ o1: 'orders' }, 'o1.uid', 't.order1_uid')
        .leftJoin({ o2: 'orders' }, 'o2.uid', 't.order2_uid')
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
    .leftJoin({ a_dec: 'assets' }, 't.amount_asset', 'a_dec.asset_id')
    .leftJoin({ p_dec: 'assets' }, 't.price_asset', 'p_dec.asset_id');

module.exports = {
  select,
  selectFromFiltered,
};
