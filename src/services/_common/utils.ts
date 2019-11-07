import { cond, propEq } from 'ramda';
import { toDbError, toTimeout } from '../../errorHandling';

export const pgErrorMatching = (meta: any) =>
  cond([
    [propEq('type', 'Db'), e => toDbError(meta, e.error)],
    [propEq('type', 'Timeout'), e => toTimeout(meta, e.error)],
  ]);
