import { Result, Error as error, Ok as ok } from 'folktale/result';
import { ValidationError } from '../errorHandling';

export const parseDate = (str: string): Result<ValidationError, Date> => {
  const d = new Date(/^-?\d+$/.test(str) ? parseInt(str) : str);
  return isNaN(d.getTime())
    ? error(new ValidationError('Date is not valid'))
    : ok(d);
};
