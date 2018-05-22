const { BigNumber } = require('@waves/data-entities');
const Joi = require('joi');
const orderTypes = prefix => ({
  [`${prefix}_id`]: Joi.string().required(),
  [`${prefix}_type`]: Joi.string().required(),
  [`${prefix}_sender`]: Joi.string().required(),
  [`${prefix}_sender_key`]: Joi.string().required(),
  [`${prefix}_signature`]: Joi.string().required(),
  [`${prefix}_price`]: Joi.object()
    .type(BigNumber)
    .required(),
  [`${prefix}_amount`]: Joi.object()
    .type(BigNumber)
    .required(),
  [`${prefix}_timestamp`]: Joi.object()
    .type(Date)
    .required(),
  [`${prefix}_expiration`]: Joi.object()
    .type(Date)
    .required(),
});

const output = Joi.object().keys({
  tx_id: Joi.string().required(),
  tx_signature: Joi.string().required(),
  tx_price_asset: Joi.string().required(),
  tx_amount_asset: Joi.string().required(),

  tx_timestamp: Joi.object()
    .type(Date)
    .required(),

  tx_price: Joi.object()
    .type(BigNumber)
    .required(),
  tx_amount: Joi.object()
    .type(BigNumber)
    .required(),
  tx_height: Joi.object()
    .type(BigNumber)
    .required(),

  matcher_addr: Joi.string().required(),
  matcher_key: Joi.string().required(),
  matcher_fee: Joi.object()
    .type(BigNumber)
    .required(),

  ...orderTypes('o1'),
  ...orderTypes('o2'),
});

module.exports = { output };

//   tx_id: '42',
//   tx_timestamp: 1526992063699,
//   tx_price: '1',
//   tx_amount: '1',
//   tx_amount_asset: 'amount_asset',
//   tx_price_asset: 'price_asset',
//   tx_signature:
//     '2uqBiMx3LdsiThVKqSb9rp2M9QjtFoW46LznsJGHh6nYpSp41p1k8CuYLqToreUXDSXQGjkkgvxxgg4JPKoLk19L',
//   tx_height: '1',
//   matcher_addr: '3PJaDyprvekvPXPuAtxrapacuDJopgJRaU3',
//   matcher_key: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
//   matcher_fee: '1',
//   o1_id: 'o1_id',
//   o1_timestamp: 1526992063699,
//   o1_sender: 'o1_sender',
//   o1_sender_key: 'o1_sender_key',
//   o1_type: 'o1_type',
//   o1_price: 'o1_price',
//   o1_amount: 'o1_amount',
//   o1_expiration: 1526992063699,
//   o1_signature: 'o1_signature',
//   o2_id: 'o2_id',
//   o2_timestamp: 1526992063699,
//   o2_sender: 'o2_sender',
//   o2_sender_key: 'o2_sender_key',
//   o2_type: 'o2_type',
//   o2_price: 'o2_price',
//   o2_amount: 'o2_amount',
//   o2_expiration: 1526992063699,
//   o2_signature: 'o2_signature',
// };
