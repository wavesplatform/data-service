import { Result, Error as error, Ok as ok } from 'folktale/result';
import { compose, defaultTo } from 'ramda';
import { ParseError } from '../../../errorHandling';
import { SortOrder } from '../../../services/_common';
import { parseDate } from '../../../utils/parseDate';
import { parseArrayQuery } from '../../utils/parseArrayQuery';
import { parseTrimmedStringIfDefined } from '../../utils/parseString';

import { CommonParsers } from './types';

const limitParser: CommonParsers['limit'] = compose(
  n => (isNaN(n) ? error(new ParseError('limit has to be a number')) : ok(n)),
  parseInt,
  String,
  defaultTo(100)
);
const sortParser: CommonParsers['sort'] = compose<
  string | undefined,
  SortOrder | string,
  Result<ParseError, SortOrder>
>(
  s =>
    [SortOrder.Ascending, SortOrder.Descending].includes(s as SortOrder)
      ? ok(s as SortOrder)
      : error(new ParseError(new Error('Invalid sort value'))),
  defaultTo<SortOrder>(SortOrder.Descending)
);
const afterParser: CommonParsers['after'] = parseTrimmedStringIfDefined;

export default {
  timeStart: parseDate,
  timeEnd: parseDate,
  limit: limitParser,
  sort: sortParser,
  after: afterParser,
  ids: parseArrayQuery,
  query: parseTrimmedStringIfDefined,
};
