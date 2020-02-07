import { Result, Error as error, Ok as ok } from 'folktale/result';
import { compose, defaultTo } from 'ramda';
import { ParseError } from '../../../errorHandling';
import { SortOrder, isSortOrder } from '../../../services/_common';
import {
  parseDate,
  parseArrayQuery,
  parseTrimmedStringIfDefined,
} from '../../../utils/parsers';

import { CommonFilters } from './types';

const limitFilter: CommonFilters['limit'] = compose(
  n =>
    isNaN(n)
      ? error(new ParseError(new Error('limit has to be a number')))
      : ok(n),
  parseInt,
  String,
  defaultTo(100)
);

const sortFilter: CommonFilters['sort'] = compose<
  string | undefined,
  SortOrder | string,
  Result<ParseError, SortOrder>
>(
  s =>
    isSortOrder(s)
      ? ok(s)
      : error(new ParseError(new Error('Invalid sort value'))),
  defaultTo<SortOrder>(SortOrder.Descending)
);

const afterFilter: CommonFilters['after'] = parseTrimmedStringIfDefined;

export default {
  timeStart: parseDate,
  timeEnd: parseDate,
  limit: limitFilter,
  sender: parseTrimmedStringIfDefined,
  sort: sortFilter,
  after: afterFilter,
  ids: parseArrayQuery,
  query: parseTrimmedStringIfDefined,
};
