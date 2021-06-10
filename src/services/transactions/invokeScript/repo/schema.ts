import { Joi } from '../../../../utils/validation';

import commonFields from '../../_common/commonFieldsSchemas';

export const result = Joi.object().keys({
  ...commonFields,

  fee_asset_id: Joi.string().required(),
  dapp: Joi.string().required(),
  call: Joi.object()
    .keys({
      function: Joi.string().noNullChars(),
      args: Joi.array().items({
        type: Joi.string(),
        value: Joi.any(),
      }),
    })
    .allow(null),
  payment: Joi.array().items({
    amount: Joi.object()
      .bignumber()
      .required(),
    assetId: Joi.string()
      .assetId()
      .required()
      .allow(null),
  }),
});
