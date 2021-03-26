import { Joi } from '../../../../utils/validation';

import commonFields from '../../_common/commonFieldsSchemas';

export const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string().assetId().required(),
  attachment: Joi.string().required().allow(''),
  transfers: Joi.array().items({
    recipient: Joi.string().allow(null),
    amount: Joi.object().bignumber().required(),
  }),
});
