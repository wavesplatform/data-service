import { Result } from 'folktale/result';
import { ParseError } from '../../../errorHandling';
import { SortOrder } from '../../../services/_common';
import { ParseDate } from '../../../utils/parsers/parseDate';
import { ParseArrayQuery } from '../../../utils/parsers/parseArrayQuery';
import { ParseTrimmedStringIfDefined } from '../../../utils/parsers/parseString';

export type CommonFilters = {
  timeStart: ParseDate;
  timeEnd: ParseDate;
  limit: Parser<number>;
  sort: Parser<SortOrder>;
  after: ParseTrimmedStringIfDefined;
  ids: ParseArrayQuery;
  query: Parser<string | undefined>;
};

export type Parser<T, R = string> = (raw?: R) => Result<ParseError, T>;
