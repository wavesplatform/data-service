import * as Joi from '../../utils/validation/joi';

export const inputSearch = Joi.object()
  .keys({
    address: Joi.string(),
    height: Joi.number(),
    timestamp: Joi.date(),
    transaction_id: Joi.string(),
    asset: Joi.string().base58(),
    limit: Joi.number().max(1000),
    after: Joi.string().base58(),
  })
  .oxor('transaction_id', 'address') // byTransaction/byAddress/byAsset request
  .required();

export const output = Joi.object().keys({
  address: Joi.binary(),
  amount: Joi.object().keys({
    assetAmount: Joi.object()
      .keys({
        amount: Joi.object()
          .long()
          .int64(),
        assetId: Joi.binary(),
      })
      .allow(null),
    wavesAmount: Joi.object()
      .long()
      .int64()
      .allow(null),
  }),
});
