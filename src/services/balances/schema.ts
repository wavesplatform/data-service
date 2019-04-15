import * as Joi from '../../utils/validation/joi';

export const inputSearch = Joi.object()
  .keys({
    address: Joi.string(),
    asset_id: Joi.string(),
    height: Joi.number(),
    timestamp: Joi.date(),
    transaction_id: Joi.string(),
  })
  .required();

export const output = Joi.object().keys({
  address: Joi.string()
    .required()
    .allow(null),
  amount: Joi.object()
    .keys({
      wavesAmount: Joi.number(),
      assetAmount: Joi.object().keys({
        assetId: Joi.string().base58(),
        amount: Joi.number(),
      }),
    })
    .or('wavesAmount', 'assetAmount'),
});
