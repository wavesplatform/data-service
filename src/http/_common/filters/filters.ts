import { Error as error, Ok as ok } from 'folktale/result';
import { isNil } from 'ramda';
import { ParseError } from '../../../errorHandling';
import { isSortOrder } from '../../../services/_common';
import {
  parseDate,
  parseArrayQuery,
  parseTrimmedStringIfDefined,
} from '../../../utils/parsers';

import { DEFAULT_MAX_LIMIT } from './';
import { CommonFilters } from './types';

// default limit is 100
const limitFilter =
  (max: number): CommonFilters['limit'] =>
  (raw) => {
    if (isNil(raw)) {
      return ok(undefined);
    } else {
      const n = parseInt(raw);
      if (isNaN(n)) {
        return error(new ParseError(new Error('limit has to be a number')));
      } else if (n > max) {
        return error(new ParseError(new Error(`Max limit ${max} exceeded`)));
      } else {
        return ok(n);
      }
    }
  };

// default sort is SortOrder.Descending
const sortFilter: CommonFilters['sort'] = (s) =>
  typeof s === 'undefined'
    ? ok(undefined)
    : isSortOrder(s)
    ? ok(s)
    : error(new ParseError(new Error('Invalid sort value')));

const afterFilter: CommonFilters['after'] = parseTrimmedStringIfDefined;

export default {
  timeStart: parseDate,
  timeEnd: parseDate,
  blockTimeStart: parseDate,
  blockTimeEnd: parseDate,
  limit: limitFilter(DEFAULT_MAX_LIMIT),
  sender: parseTrimmedStringIfDefined,
  senders: parseArrayQuery,
  sort: sortFilter,
  after: afterFilter,
  ids: parseArrayQuery,
  query: parseTrimmedStringIfDefined,
};
