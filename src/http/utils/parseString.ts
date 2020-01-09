import { Ok as ok } from 'folktale/result';
import { Parser } from '../_common/filters/types';

export type ParseTrimmedStringIfDefined = Parser<string | undefined>;

export const parseTrimmedStringIfDefined: ParseTrimmedStringIfDefined = <
  T extends Object
>(
  q?: T
) => ok(typeof q === 'undefined' ? undefined : q.toString().trim());
