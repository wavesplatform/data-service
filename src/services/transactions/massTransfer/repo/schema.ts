import { Joi } from '../../../../utils/validation';

import commonFields from '../../_common/commonFieldsSchemas';

export const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string().assetId().required(),
  attachment: Joi.string().required().allow(''),
  recipients: Joi.array().items(Joi.string().allow(null)),
  amounts: Joi.array().items(Joi.object().bignumber().required()),
});
