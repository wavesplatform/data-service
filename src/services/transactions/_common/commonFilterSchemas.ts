import { Joi } from '../../../utils/validation';
import commonFilterSchemas from '../../presets/pg/searchWithPagination/commonFilterSchemas';

import { deserialize } from './cursor';

const DATE0 = new Date(0);

export default {
  ...commonFilterSchemas(deserialize),
  timeStart: Joi.date().min(DATE0),
  timeEnd: Joi.when('timeStart', {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref('timeStart')),
    otherwise: Joi.date().min(DATE0),
  }),
  sort: Joi.string().valid('asc', 'desc'),
  sender: Joi.string().base58(),
  senders: Joi.array().items(Joi.string().base58())
};
