const Joi = require('joi');

const { output } = require('./common');

const input = Joi.object()
  .keys({
    timeStart: Joi.object().type(Date),
    timeEnd: Joi.object().type(Date),
    limit: Joi.number(),
    sort: Joi.string(),
    matcher: Joi.string(),
    sender: Joi.string()
  })
  .required();

module.exports = { input, output };
