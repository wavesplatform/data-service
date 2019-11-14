import { Result } from 'folktale/result';

import { Joi } from '../../../../utils/validation';
import { ValidationError } from '../../../../errorHandling';

export default <Cursor>(
  decode: (cursor: string) => Result<ValidationError, Cursor>
) => ({
  limit: Joi.number()
    .min(1)
    .max(100)
    .required(),
  after: Joi.cursor(decode).valid(),
});
