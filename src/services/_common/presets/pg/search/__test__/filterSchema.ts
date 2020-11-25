import { Joi } from '../../../../../utils/validation';
import { CursorSerialization } from 'services/_common/pagination';

const DATE0 = new Date(0);

export default <Cursor, Request, Response>(
  deserialize: CursorSerialization<Cursor, Request, Response>['deserialize']
) => Joi.object().keys({
  timeStart: Joi.date().min(DATE0),
  timeEnd: Joi.when('timeStart', {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref('timeStart')),
    otherwise: Joi.date().min(DATE0),
  }),
  sort: Joi.string().valid('asc', 'desc'),
  limit: Joi.number()
    .min(1)
    .max(100)
    .required(),
  after: Joi.cursor().valid(deserialize),
});
