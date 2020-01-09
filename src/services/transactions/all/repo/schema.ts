import { Joi } from '../../../../utils/validation';

export const result = Joi.object().keys({
  tx_type: Joi.number()
    .min(1)
    .max(16)
    .required(),
  time_stamp: Joi.date().required(),
  id: Joi.string()
    .base58()
    .required(),
});
