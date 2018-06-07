const Joi = require('joi');

const { output } = require('./common');
const DATE0 = new Date(0);
const input = Joi.object()
  .keys({
    timeStart: Joi.date().min(DATE0),
    timeEnd: Joi.when('timeStart', {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref('timeStart')),
      otherwise: Joi.date().min(0),
    }),
    limit: Joi.number()
      .min(1)
      .max(100),
    sort: Joi.string(),
    matcher: Joi.string(),
    sender: Joi.string(),
    amountAsset: Joi.string(),
    priceAsset: Joi.string(),
  })
  .required();

module.exports = { input, output };
