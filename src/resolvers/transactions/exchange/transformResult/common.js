/** transformTx:: RawTxInfo -> TxInfo */
const transformTx = tx => {
  const {
    tx_id,
    matcher_addr,
    matcher_key,
    matcher_fee,
    tx_timestamp,
    tx_signature,
    tx_price,
    tx_amount,
    tx_height,
  } = tx;

  return {
    type: 7,
    id: tx_id,
    sender: matcher_addr,
    senderPublicKey: matcher_key,
    fee: matcher_fee,
    timestamp: tx_timestamp,
    signature: tx_signature,
    order1: createOrder('o1')(tx),
    order2: createOrder('o2')(tx),
    price: tx_price,
    amount: tx_amount,
    buyMatcherFee: matcher_fee,
    sellMatcherFee: undefined,
    height: tx_height,
  };
};

const createOrder = prefix => ({
  [`${prefix}_id`]: id,
  [`${prefix}_sender_key`]: senderPublicKey,
  [`${prefix}_type`]: orderType,
  [`${prefix}_price`]: price,
  [`${prefix}_amount`]: amount,
  [`${prefix}_timestamp`]: timestamp,
  [`${prefix}_expiration`]: expiration,
  [`${prefix}_signature`]: signature,
  matcher_fee: matcherFee,
  tx_price_asset: priceAsset,
  tx_amount_asset: amountAsset,
  tx_matcher_key: matcherPublicKey,
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
  amount,
  timestamp,
  expiration,
  matcherFee,
  signature,
});

module.exports = { transformTx };
