const { BigNumber } = require('@waves/data-entities');

const txMock = {
  tx_id: '42',
  tx_timestamp: new Date(),
  tx_price: new BigNumber(1),
  tx_amount: new BigNumber(1),
  tx_height: new BigNumber(1),
  tx_amount_asset: 'amount_asset',
  tx_price_asset: 'price_asset',
  tx_signature:
    '2uqBiMx3LdsiThVKqSb9rp2M9QjtFoW46LznsJGHh6nYpSp41p1k8CuYLqToreUXDSXQGjkkgvxxgg4JPKoLk19L',

  matcher_addr: '3PJaDyprvekvPXPuAtxrapacuDJopgJRaU3',
  matcher_key: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
  matcher_fee: new BigNumber(1),

  // order1
  o1_id: 'o1_id',
  o1_sender_key: 'o1_sender_key',
  o1_price: new BigNumber(1),
  o1_amount: new BigNumber(1),
  o1_timestamp: new Date(),
  o1_expiration: new Date(),
  o1_sender: 'o1_sender',
  o1_type: 'o1_type',
  o1_signature: 'o1_signature',

  //order2
  o2_id: 'o2_id',
  o2_timestamp: new Date(),
  o2_expiration: new Date(),
  o2_sender: 'o2_sender',
  o2_sender_key: 'o2_sender_key',
  o2_type: 'o2_type',
  o2_price: new BigNumber(1),
  o2_amount: new BigNumber(1),
  o2_signature: 'o2_signature',
};
module.exports = txMock;

// // order
// {
//   "id": o1_id,
//   "senderPublicKey": o1_sender_key,
//   "matcherPublicKey": matcher_key,
//   "assetPair": {
//     "amountAsset": amount_asset,
//     "priceAsset": price_asset
//   },
//   "orderType": o1_type
//   "price": o1_price,
//   "amount": o1_amount,
//   "timestamp": o1_timestamp,
//   "expiration": o1_expiration,
//   "matcherFee": matcher_fee,
//   "signature": o1_signature
// }

// {
//   "type": 7,
//   "id": tx_id,
//   "sender": matcher_addr,
//   "senderPublicKey": matcher_key,
//   "fee": matcher_fee,
//   "timestamp": tx_timestamp,
//   "signature": tx_signature,
//   "order1": {
//     "id": "Ghojw5sSSL3NNid81PRrSotY913EcnyJPNaa4xtvVmB9",
//     "senderPublicKey": "3FQtBZWd2PYSRyehzDNEr1YQC29Vd5pCYqiN4nRhnxQK",
//     "matcherPublicKey": "7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy",
//     "assetPair": {
//       "amountAsset": "AxAmJaro7BJ4KasYiZhw7HkjwgYtt2nekPuF2CN9LMym",
//       "priceAsset": null
//     },
//     "orderType": "buy",
//     "price": 1051805,
//     "amount": 14241831232,
//     "timestamp": 1509803501624,
//     "expiration": 1509889901624,
//     "matcherFee": 300000,
//     "signature": "4Reo3ad5bqE8WUUpbvvVDqvk5Et9Z7wAJ4opQfwMCcpSZMMxMipdKaB7ioiGkjR6zQCccqjVKwM9hroqqSoGJZZu"
//   },
//   "order2": {
//     "id": "ExLx9vb61wbRtvV5ZMwFxv3HP1D7GhjS2AZsG2tFKGhe",
//     "senderPublicKey": "2a4ZB67L3vRP7Re7GzsPV9Vudy7usgHZmkeKCVqe8aSn",
//     "matcherPublicKey": "7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy",
//     "assetPair": {
//       "amountAsset": "AxAmJaro7BJ4KasYiZhw7HkjwgYtt2nekPuF2CN9LMym",
//       "priceAsset": null
//     },
//     "orderType": "sell",
//     "price": 880000,
//     "amount": 2378261064977,
//     "timestamp": 1509803578799,
//     "expiration": 1511531578799,
//     "matcherFee": 300000,
//     "signature": "4PPiH4k8Qz1zAg8UCocCyHXiEq8PtFwUcLEAbDsYgZH3qp6u2oFYZHJoq8mz2SNepshya1Ur1w3gVdR2Vzto8sG6"
//   },
//   "price": tx_price,
//   "amount": tx_amount,
//   "buyMatcherFee": matcher_fee,
//   "sellMatcherFee": ???,
//   "height": tx_height
// }
