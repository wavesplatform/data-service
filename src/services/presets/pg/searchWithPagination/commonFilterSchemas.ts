import { Joi } from '../../../../utils/validation';
import { CursorSerialization } from 'services/_common/pagination';

export default <Cursor, Request, Response>(
  deserialize: CursorSerialization<Cursor, Request, Response>['deserialize']
) => ({
  limit: Joi.number()
    .min(1)
    .max(100)
    .required(),
  after: Joi.cursor().valid(deserialize),
});
