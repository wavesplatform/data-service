import { Joi } from '../../../../utils/validation';

import commonFields from '../../_common/commonFieldsSchemas';

const CORRECT_TYPE = Joi.string().valid([
  'integer',
  'boolean',
  'string',
  'binary',
]);

export const result = Joi.object().keys({
  ...commonFields,
  data: Joi.array()
    .items(
      Joi.object().keys({
        key: Joi.string()
          .allow('')
          .required(),
        type: CORRECT_TYPE.required(),
        value: [
          Joi.object()
            .bignumber()
            .int64(),
          Joi.string().allow(''),
          Joi.boolean(),
        ],
      })
    )
    .required(),
});
