const Joi = require('joi');

const toValidate = [
  {
    id: '231498akjs',
    ticker: 'BTC',
    timestamp: new Date(),
  },
  null,
  {
    id: '231498akjs',
    timestamp: new Date(),
  },
];

const schema = Joi.array().items(
  Joi.object()
    .keys({
      id: Joi.string(),
      ticker: Joi.string(),
      timestamp: Joi.object().type(Date),
    })
    .requiredKeys(['id', 'timestamp'])
    .allow(null)
);

// eslint-disable-next-line
console.log(Joi.validate(toValidate, schema));
