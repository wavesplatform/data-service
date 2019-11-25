import { Joi } from '../../../../utils/validation';
import { CursorDecode } from '../../../_common/pagination';

export default <Cursor>(decode: CursorDecode<Cursor>) => ({
  limit: Joi.number()
    .min(1)
    .max(100)
    .required(),
  after: Joi.cursor().valid(decode),
});
