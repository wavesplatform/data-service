import { Ok as ok } from 'folktale/result';
import { isNil } from 'ramda';
import { Parser } from '../../http/_common/filters/types';

export type ParseTrimmedStringIfDefined = Parser<string>;

export const parseTrimmedStringIfDefined: ParseTrimmedStringIfDefined = q =>
  ok(isNil(q) ? undefined : q.toString().trim());
