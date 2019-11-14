import { Result } from 'folktale/result';

import { Joi } from '../../../utils/validation';
import { ValidationError } from '../../../errorHandling';
import { Cursorable } from '../../_common/pagination';
import commonFilterSchemas from '../../presets/pg/searchWithPagination/commonFilterSchemas';

const DATE0 = new Date(0);

export default (
  decode: (cursor: string) => Result<ValidationError, Cursorable>
) => ({
  ...commonFilterSchemas(decode),
  timeStart: Joi.date().min(DATE0),
  timeEnd: Joi.when('timeStart', {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref('timeStart')),
    otherwise: Joi.date().min(DATE0),
  }),
  sort: Joi.string().valid('asc', 'desc'),
  sender: Joi.string().base58(),
});
