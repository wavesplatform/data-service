import { Result } from 'folktale/result';
import { ParseError } from '../../../errorHandling';
import { SortOrder } from '../../../services/_common';
import { ParseDate } from '../../../utils/parseDate';
import { ParseArrayQuery } from '../../utils/parseArrayQuery';
import { ParseTrimmedStringIfDefined } from '../../utils/parseString';

export type CommonParsers = {
  timeStart: ParseDate;
  timeEnd: ParseDate;
  limit: Parser<number>;
  sort: Parser<SortOrder>;
  after: ParseTrimmedStringIfDefined;
  ids: ParseArrayQuery;
  query: Parser<string | undefined>;
};

export type Parser<T, R = string> = (raw?: R) => Result<ParseError, T>;
