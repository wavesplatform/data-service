import { Joi } from '../../../../utils/validation';

import commonFields from '../../_common/commonFieldsSchemas';

const orderTypes = (prefix: string) => ({
  [`${prefix}_id`]: Joi.string()
    .base58()
    .required(),
  [`${prefix}_version`]: Joi.string()
    .noNullChars()
    .required()
    .allow(null),
  [`${prefix}_type`]: Joi.string()
    .noNullChars()
    .required(),
  [`${prefix}_sender`]: Joi.string()
    .base58()
    .required(),
  [`${prefix}_sender_public_key`]: Joi.string()
    .base58()
    .required(),
  [`${prefix}_signature`]: Joi.string()
    .base58()
    .required(),
  [`${prefix}_matcher_fee`]: Joi.object()
    .bignumber()
    .required(),
  [`${prefix}_price`]: Joi.object()
    .bignumber()
    .required(),
  [`${prefix}_amount`]: Joi.object()
    .bignumber()
    .required(),
  [`${prefix}_time_stamp`]: Joi.object()
    .type(Date)
    .required(),
  [`${prefix}_expiration`]: Joi.object()
    .type(Date)
    .required(),
  [`${prefix}_matcher_fee_asset_id`]: Joi.string()
    .assetId()
    .allow(null),
});

export const result = Joi.object().keys({
  ...commonFields,

  price_asset: Joi.string()
    .assetId()
    .required(),
  amount_asset: Joi.string()
    .assetId()
    .required(),
  price: Joi.object()
    .bignumber()
    .required(),
  amount: Joi.object()
    .bignumber()
    .required(),
  buy_matcher_fee: Joi.object()
    .bignumber()
    .required(),
  sell_matcher_fee: Joi.object()
    .bignumber()
    .required(),

  ...orderTypes('o1'),
  ...orderTypes('o2'),
});
