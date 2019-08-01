const Joi = require('../../utils/validation/joi');

export const input = Joi.object()
  .keys(
    {
      amountAsset: Joi.string()
        .base58()
        .required(),
      priceAsset: Joi.string()
        .base58()
        .required(),
    }
  );

export const result = Joi.object().keys({
  current: Joi.object()
    .bignumber()
    .required(),
});
