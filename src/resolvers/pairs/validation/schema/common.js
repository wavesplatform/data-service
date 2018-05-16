const Joi = require('joi');
// const { BigNumber } = require('@waves/data-entities');

// const output = Joi.object().keys({
//   first_price: Joi.object()
//     .type(BigNumber)
//     .required(),
//   last_price: Joi.object()
//     .type(BigNumber)
//     .required(),
//   volume: Joi.object()
//     .type(BigNumber)
//     .required(),
// });
const output = Joi.object().keys({
  first_price: Joi.number().required(),
  last_price: Joi.number().required(),
  volume: Joi.number().required(),
});

const assetsIdRegex = /[0-9A-Za-z]+\/[0-9A-Za-z]+/;
module.exports = { output, assetsIdRegex };
