/** transformTx:: RawTxInfo -> TxInfo */
const transformTxInfo = tx => {
  const {
    tx_id,
    tx_sender,
    tx_sender_public_key,
    tx_buy_matcher_fee,
    tx_time_stamp,
    tx_signature,
    tx_price,
    tx_amount,
    tx_height,
    tx_fee,
    tx_sell_matcher_fee,
  } = tx;

  return {
    type: 7,
    id: tx_id,
    sender: tx_sender,
    senderPublicKey: tx_sender_public_key,
    fee: tx_fee,
    timestamp: tx_time_stamp,
    signature: tx_signature,
    order1: createOrder('o1')(tx),
    order2: createOrder('o2')(tx),
    price: tx_price,
    amount: tx_amount,
    buyMatcherFee: tx_buy_matcher_fee,
    sellMatcherFee: tx_sell_matcher_fee,
    height: tx_height,
  };
};

const createOrder = prefix => ({
  [`${prefix}_id`]: id,
  [`${prefix}_sender_public_key`]: senderPublicKey,
  [`${prefix}_sender`]: sender,
  [`${prefix}_type`]: orderType,
  [`${prefix}_price`]: price,
  [`${prefix}_amount`]: amount,
  [`${prefix}_time_stamp`]: timestamp,
  [`${prefix}_expiration`]: expiration,
  [`${prefix}_signature`]: signature,
  [`${prefix}_matcher_fee`]: matcherFee,
  tx_price_asset: priceAsset,
  tx_amount_asset: amountAsset,
  tx_sender_public_key: matcherPublicKey,
}) => ({
  id,
  senderPublicKey,
  matcherPublicKey,
  assetPair: {
    amountAsset,
    priceAsset,
  },
  orderType,
  price,
  sender,
  amount,
  timestamp,
  expiration,
  matcherFee,
  signature,
});

module.exports = transformTxInfo;
