const rawJoi = require('joi');
const Cursor = require('../../../_common/pagination/cursor');
const DATE0 = new Date(0);
const Joi = rawJoi.extend(joi => ({
  base: joi.string().base64({ paddingRequired: false }),
  name: 'cursor',
  rules: [
    {
      name: 'valid',
      validate(_, value, state, options) {
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

module.exports = {
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
  sort: Joi.string().valid('asc', 'desc'),
  after: Joi.cursor().valid(),
  sender: Joi.string(),
};
