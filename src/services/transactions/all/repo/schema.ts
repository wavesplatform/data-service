import { Joi } from '../../../../utils/validation';

export const result = Joi.object().keys({
  tx_uid: Joi.object()
    .bignumber()
    .required(),
  tx_type: Joi.number()
    .min(1)
    .max(16)
    .required(),
  time_stamp: Joi.date().required(),
  id: Joi.string()
    .base58()
    .required(),
  height: Joi.number().required(),
  position_in_block: Joi.number().required(),
});
