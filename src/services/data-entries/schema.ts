import * as Joi from '../../utils/validation/joi';

export const inputSearch = Joi.object()
  .keys({
    address: Joi.string(),
    height: Joi.number(),
    timestamp: Joi.date(),
    transaction_id: Joi.string(),
    key: Joi.string(),
    type: Joi.number().valid([1, 2, 3, 4]),
    binary_value: Joi.string(),
    bool_value: Joi.boolean(),
    int_value: Joi.number(),
    string_value: Joi.string(),
  })
  .with('binary_value', 'type')
  .with('bool_value', 'type')
  .with('int_value', 'type')
  .with('string_value', 'type')
  .oxor('transaction_id', 'address')  // byTransaction/byAddress/Search request
  .required();

export const output = Joi.object().keys({
  address: Joi.binary(),
  entry: Joi.object()
    .keys({
      key: Joi.string().required(),
      binaryValue: Joi.binary().allow(''),
      boolValue: Joi.boolean(),
      intValue: Joi.object()
        .long()
        .int64()
        .allow(null),
      stringValue: Joi.string().allow(''),
    })
    .required(),
});
