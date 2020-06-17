import * as Joi from '../../../utils/validation/joi';

import * as commonFields from '../_common/commonFieldsSchemas';
import commonFilters from '../_common/commonFilterSchemas';

export const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    dapp: Joi.string(),
    function: Joi.string(),
  })
  .nand('sender', 'senders');

export const result = Joi.object().keys({
  ...commonFields,

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
