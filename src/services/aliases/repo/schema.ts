import * as Joi from '../../../utils/validation/joi';

export const output = Joi.object().keys({
  address: Joi.string()
    .base58()
    .required()
    .allow(null),
  alias: Joi.string().required(),
  duplicates: Joi.object().bignumber(),
});
