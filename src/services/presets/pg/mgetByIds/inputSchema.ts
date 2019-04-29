import * as Joi from '../../../../utils/validation/joi';

export const inputMget = Joi.array()
  .items(Joi.string().base58())
  .required();
