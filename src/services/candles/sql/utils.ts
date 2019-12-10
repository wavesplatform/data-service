import { findLast } from 'ramda';
import { Result, Ok as ok, Error as error } from 'folktale/result';
import { Interval } from '../../../types';
import { div } from '../../../utils/interval';
import { ValidationError } from '../../../errorHandling';

export const highestDividerLessThan = (
  inter: Interval,
  dividers: Interval[]
): Result<ValidationError, Interval> => {
  const i = findLast((i: Interval) => div(inter, i) >= 1, dividers);
  return i ? ok(i) : error(new ValidationError('Divider not found'));
};
