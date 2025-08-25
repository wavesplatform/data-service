import { Joi } from '../../../../utils/validation';
import commonFields from '../../_common/commonFieldsSchemas';

export const result = Joi.object().keys({
  ...commonFields,
  bytes: Joi.binary().required(),
  function_name: Joi.string().required().allow(null),
});
