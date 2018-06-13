const { BigNumber } = require('@waves/data-entities');
const Joi = require('joi');

const BIGNUMBER = Joi.object()
  .type(BigNumber)
  .required();

const CORRECT_TYPE = Joi.string().valid([
  'integer',
  'boolean',
  'string',
  'binary',
]);

const output = Joi.object().keys({
  tx_type: Joi.number().required(),
  tx_version: Joi.number(),
  height: Joi.number().required(),

  id: Joi.string().required(),
  signature: Joi.string().allow(null),
  proofs: Joi.array(),
  time_stamp: Joi.date().required(),

  fee: BIGNUMBER,

  sender: Joi.string().required(),
  sender_public_key: Joi.string().required(),

  data: Joi.array().items(
    Joi.object().keys({
      key: Joi.string()
        .required()
        .allow(''),
      type: CORRECT_TYPE.required(),
      value: [BIGNUMBER, Joi.string().allow(''), Joi.boolean().required()],
    })
  ),
});

module.exports = { output, CORRECT_TYPE, BIGNUMBER };
