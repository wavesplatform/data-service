const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas')
  .default;

const CORRECT_TYPE = Joi.string().valid([
  'integer',
  'boolean',
  'string',
  'binary',
]);

const result = Joi.object().keys({
  ...commonFields,
  data: Joi.array()
    .items(
      Joi.object().keys({
        key: Joi.string()
          .noControlChars()
          .allow('')
          .required(),
        type: CORRECT_TYPE.required(),
        value: [
          Joi.object()
            .bignumber()
            .int64(),
          Joi.string().noControlChars().allow(''),
          Joi.boolean(),
        ],
      })
    )
    .required(),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    key: Joi.string().noControlChars(),
    type: CORRECT_TYPE,
    value: Joi.when('type', {
      is: 'integer',
      then: Joi.object()
        .bignumber()
        .notNan()
        .int64(),
    })
      .when('type', {
        is: 'boolean',
        then: Joi.boolean(),
      })
      .when('type', {
        is: ['string', 'binary'],
        then: Joi.string().noControlChars().allow(''),
      }),
  })
  .with('value', 'type')
  .required();

module.exports = { result, inputSearch };
