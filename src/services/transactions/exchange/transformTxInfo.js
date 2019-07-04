const { pick, compose } = require('ramda');
const { renameKeys } = require('ramda-adjunct');

const transformTxInfo = require('../_common/transformTxInfo');

const createOrder = prefix => ({
  [`${prefix}_id`]: id,
  [`${prefix}_version`]: version,
  [`${prefix}_sender_public_key`]: senderPublicKey,
  [`${prefix}_sender`]: sender,
  [`${prefix}_type`]: orderType,
  [`${prefix}_price`]: price,
  [`${prefix}_amount`]: amount,
  [`${prefix}_time_stamp`]: timestamp,
  [`${prefix}_expiration`]: expiration,
  [`${prefix}_signature`]: signature,
  [`${prefix}_matcher_fee`]: matcherFee,
  [`${prefix}_matcher_fee_asset_id`]: matcherFeeAssetId,
  price_asset: priceAsset,
  amount_asset: amountAsset,
  sender_public_key: matcherPublicKey,
}) => {
  const tx = {
    id,
    senderPublicKey,
    matcherPublicKey,
    assetPair: {
      amountAsset,
      priceAsset,
    },
    orderType,
    price,
    orderSender: sender,
    amount,
    timestamp,
    expiration,
    matcherFee,
    signature,
  };
  return version === '3' ? { ...tx, matcherFeeAssetId } : tx;
};

/** transformTx:: RawTxInfo -> TxInfo */
module.exports = tx => {
  const commonFields = compose(
    transformTxInfo,
    pick([
      'id',
      'time_stamp',
      'height',
      'tx_type',
      'tx_version',
      'signature',
      'proofs',
      'fee',
      'sender',
      'sender_public_key',
    ])
  )(tx);

  const exchangeTxFields = compose(
    renameKeys({
      buy_matcher_fee: 'buyMatcherFee',
      sell_matcher_fee: 'sellMatcherFee',
    }),
    pick(['buy_matcher_fee', 'sell_matcher_fee', 'price', 'amount'])
  )(tx);

  return {
    ...commonFields,
    ...exchangeTxFields,
    order1: createOrder('o1')(tx),
    order2: createOrder('o2')(tx),
  };
};
