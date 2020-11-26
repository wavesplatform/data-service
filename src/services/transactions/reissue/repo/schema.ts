import { Joi } from '../../../../utils/validation';

import commonFields from '../../_common/commonFieldsSchemas';

export const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .assetId()
    .required(),
  quantity: Joi.object()
    .bignumber()
    .required(),
  reissuable: Joi.boolean().required(),
});
