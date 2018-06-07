const rawJoi = require('joi');
const { output } = require('./common');
const Cursor = require('../../pagination/cursor');

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
    timeStart: Joi.object().type(Date),
    timeEnd: Joi.object().type(Date),
    limit: Joi.number(),
    sort: Joi.string(),
    matcher: Joi.string(),
    sender: Joi.string(),
    amountAsset: Joi.string(),
    priceAsset: Joi.string(),
    after: Joi.cursor().valid(),
  })
  .required();

module.exports = { input, output };
