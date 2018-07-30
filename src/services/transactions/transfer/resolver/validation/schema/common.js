const Joi = require('joi');
const { BigNumber } = require('@waves/data-entities');

const hashRegex = /[0-9A-Za-z]+/;

const output = Joi.object()
  .keys({
    height: Joi.number().required(),
    tx_type: Joi.number().required(),
    tx_version: Joi.number().required(),
    fee: Joi.object()
      .type(BigNumber)
      .required(),
    amount: Joi.object()
      .type(BigNumber)
      .required(),
    time_stamp: Joi.date().required(),
    signature: Joi.string().required(),
    proofs: Joi.required(),
    id: Joi.string()
      .regex(hashRegex)
      .required(),
    asset_id: Joi.string()
      .regex(hashRegex)
      .required(),
    fee_asset: Joi.string()
      .regex(hashRegex)
      .required(),
    attachment: Joi.string()
      .required()
      .allow(''),
    sender: Joi.string().required(),
    sender_public_key: Joi.string().required(),
    recipient: Joi.string().required(),
  })
  .or('proofs', 'signature');

module.exports = { output, hashRegex };
