import { Joi } from '../../../utils/validation';

export default {
  uid: Joi.object().bignumber().required(),
  id: Joi.string().base58().required(),
  height: Joi.number().required(),
  tx_type: Joi.number().min(1).max(18).required(),
  tx_version: Joi.number().required().allow(null),
  fee: Joi.object().bignumber().required(),
  time_stamp: Joi.date().required(),
  signature: Joi.string().base58().required().allow(null),
  proofs: Joi.array().required(),
  status: Joi.string().required(),
  sender: Joi.string().base58().required(),
  sender_public_key: Joi.string().base58().required(),
};
