const rawJoi = require('joi');
const { output } = require('./common');
const Cursor = require('../../../../../../resolvers/pagination/cursor');
const DATE0 = new Date(0);
const Joi = rawJoi.extend(joi => ({
  base: joi.string().base64({ paddingRequired: false }),
  name: 'cursor',
  rules: [
    {
      name: 'valid',
      validate(params, value, state, options) {
        const [ts, id, sort] = Cursor.decode(value);
        if (!ts || !id || !sort) {
          // Generate an error, state and options need to be passed
          return this.createError('cursor.wrong', { v: value }, state, options);
        }
        return value; // Everything is OK
      },
    },
  ],
}));

const input = Joi.object()
  .keys({
    timeStart: Joi.date().min(DATE0),
    timeEnd: Joi.when('timeStart', {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref('timeStart')),
      otherwise: Joi.date().min(DATE0),
    }),
    limit: Joi.number()
      .min(1)
      .max(100)
      .required(),
    sort: Joi.string(),
    after: Joi.cursor().valid(),

    sender: Joi.string(),
    assetId: Joi.string(),
    recipient: Joi.string(),
  })
  .required();

module.exports = { input, output };
