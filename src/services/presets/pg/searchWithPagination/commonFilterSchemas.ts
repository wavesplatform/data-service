import * as rawJoi from 'joi';

import { Joi } from '../../../../utils/validation';
import { decode } from '../../../_common/pagination/cursor';

const DATE0 = new Date(0);

const CustomJoi = Joi.extend(
  (joi: rawJoi.Root): rawJoi.Extension => ({
    base: joi.string().base64({ paddingRequired: false }),
    name: 'cursor',
    language: {
      wrong: 'must be a valid cursor string',
    },
    rules: [
      {
        name: 'valid',
        validate(_, value, state, options) {
          return decode(value).matchWith({
            Ok: () => value,
            Error: () =>
              this.createError('cursor.wrong', { v: value }, state, options),
          });
        },
      },
    ],
  })
);

export default {
  timeStart: CustomJoi.date().min(DATE0),
  timeEnd: CustomJoi.when('timeStart', {
    is: CustomJoi.exist(),
    then: CustomJoi.date().min(CustomJoi.ref('timeStart')),
    otherwise: CustomJoi.date().min(DATE0),
  }),
  limit: CustomJoi.number()
    .min(1)
    .max(100)
    .required(),
  sort: CustomJoi.string().valid('asc', 'desc'),
  after: CustomJoi.cursor().valid(),
  sender: CustomJoi.string().base58(),
};
