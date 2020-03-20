import { Result, Error as error, Ok as ok } from 'folktale/result';
import { compose } from 'ramda';
import { ParseError } from '../../../errorHandling';
import { isSortOrder } from '../../../services/_common';
import {
  parseDate,
  parseArrayQuery,
  parseTrimmedStringIfDefined,
} from '../../../utils/parsers';

import { CommonFilters } from './types';

// default limit is 100
const limitFilter: CommonFilters['limit'] = raw =>
  typeof raw === 'undefined'
    ? ok(undefined)
    : compose<string, number, Result<ParseError, number>>(
        n =>
          isNaN(n)
            ? error(new ParseError(new Error('limit has to be a number')))
            : ok(n),
        parseInt
      )(raw);

// default sort is SortOrder.Descending
const sortFilter: CommonFilters['sort'] = s =>
  typeof s === 'undefined'
    ? ok(undefined)
    : isSortOrder(s)
    ? ok(s)
    : error(new ParseError(new Error('Invalid sort value')));

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
