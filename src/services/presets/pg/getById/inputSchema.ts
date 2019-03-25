import * as Joi from '../../../../utils/validation/joi';

export const inputGet = Joi.string()
  .base58()
  .required();
