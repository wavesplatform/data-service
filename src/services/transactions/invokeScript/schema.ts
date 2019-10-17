import * as Joi from '../../../utils/validation/joi';

import * as commonFields from '../_common/commonFieldsSchemas';
import commonFilters from '../../presets/pg/searchWithPagination/commonFilterSchemas';

export const result = Joi.object().keys({
  ...commonFields,

  dapp: Joi.string().noControlChars().required(),
  call: Joi.object()
    .keys({
      function: Joi.string().noControlChars(),
      args: Joi.array().items({
        type: Joi.string().noControlChars(),
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

export const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    dapp: Joi.string(),
    function: Joi.string(),
  })
  .required();
