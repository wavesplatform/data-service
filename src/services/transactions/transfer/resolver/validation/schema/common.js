const Joi = require('joi');
const { BigNumber } = require('@waves/data-entities');

const { base58 } = require('../../../../../../utils/regex');

const output = Joi.object().keys({
  height: Joi.number().required(),
  tx_type: Joi.number().required(),
  tx_version: Joi.number()
    .required()
    .allow(null),
  fee: Joi.object()
    .type(BigNumber)
    .required(),
  amount: Joi.object()
    .type(BigNumber)
    .required(),
  time_stamp: Joi.date().required(),

  signature: Joi.string()
    .required()
    .allow(''),
  proofs: Joi.when('signature', {
    is: '',
    then: Joi.array().min(1),
    otherwise: Joi.array().length(0),
  }).required(),
  id: Joi.string()
    .regex(base58)
    .required(),
  asset_id: Joi.string()
    .regex(base58)
    .required(),
  fee_asset: Joi.string()
    .regex(base58)
    .required(),
  attachment: Joi.string()
    .required()
    .allow(''),
  sender: Joi.string().required(),
  sender_public_key: Joi.string().required(),
  recipient: Joi.string().required(),
});

module.exports = { output };
