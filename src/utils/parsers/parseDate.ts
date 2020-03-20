import { Error as error, Ok as ok } from 'folktale/result';
import { isNil } from 'ramda';
import { ParseError } from '../../errorHandling';
import { Parser } from '../../http/_common/filters/types';

export type ParseDate = Parser<Date>;

export const parseDate: ParseDate = str => {
  if (isNil(str)) return ok(undefined);

  const d = new Date(/^-?\d+$/.test(str) ? parseInt(str) : str);
  return isNaN(d.getTime())
    ? error(new ParseError('Date is not valid'))
    : ok(d);
};
