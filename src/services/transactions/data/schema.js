const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas');

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

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    sender: Joi.string(),
    key: Joi.string(),
    type: CORRECT_TYPE,
    // value: [BIGNUMBER, Joi.string().allow(''), Joi.boolean()],
    // value: Joi.alternatives().try([
    // Joi.when('type', {
    //   is: Joi.valid('integer').required(),
    //   then: Joi.object()
    //     .bignumber()
    //     .int64(),
    // }),
    //   Joi.when('type', {
    //     is: Joi.valid('boolean').required(),
    //     then: Joi.boolean(),
    //   }),
    //   Joi.when('type', {
    //     is: Joi.valid('string').required(),
    //     then: Joi.string().allow(''),
    //   }),
    //   Joi.when('type', {
    //     is: Joi.valid('binary').required(),
    //     then: Joi.string()
    //       .base64()
    //       .allow(''),
    //   }),
    // ]),
    value: Joi.when('type', {
      is: 'integer',
      then: Joi.object()
        .bignumber()
        .int64(),
    })
      .when('type', {
        is: 'boolean',
        then: Joi.boolean(),
      })
      .when('type', {
        is: ['string', 'binary'],
        then: Joi.string().allow(''),
      }),
  })
  .with('value', 'type')
  .required();

module.exports = { result, inputSearch };
