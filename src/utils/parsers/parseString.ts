import { Ok as ok } from 'folktale/result';
import { isNil } from 'ramda';
import { Parser } from '../../http/_common/filters/types';

export type ParseTrimmedStringIfDefined = Parser<string | undefined>;

export const parseTrimmedStringIfDefined: ParseTrimmedStringIfDefined = (
  q?: string
) => ok(isNil(q) ? undefined : q.toString().trim());
