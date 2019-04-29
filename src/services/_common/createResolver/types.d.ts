import { Task } from 'folktale/concurrency/task';
import { Result } from 'folktale/result';
import { Maybe } from 'folktale/maybe';
import {
  ValidationError,
  ResolverError,
  DbError,
  AppError,
} from '../../../errorHandling/';

import { PgDriver } from '../../../db/driver';

export type EmitEvent = {
  (name: string): <A>(object: A) => void;
};

export type Validate<Error, Value> = (value: Value) => Result<Error, Value>;

type CommonResolverDependencies<
  ReqRaw,
  ReqTransformed,
  ResRaw,
  ResTransformed
> = {
  validateInput: Validate<ValidationError, ReqRaw>;
  transformInput: (r: ReqRaw) => ReqTransformed;
  validateResult: Validate<ResolverError, ResRaw>;
};

export type GetResolverDependencies<
  ReqRaw,
  ReqTransformed,
  ResRaw,
  ResTransformed
> = CommonResolverDependencies<
  ReqRaw,
  ReqTransformed,
  ResRaw,
  ResTransformed
> & {
  dbQuery: (
    db: PgDriver
  ) => (r: ReqTransformed) => Task<DbError, Maybe<ResRaw>>;
  transformResult: (
    result: Maybe<ResRaw>,
    request: ReqRaw
  ) => Maybe<ResTransformed>;
};

export type MgetResolverDependencies<
  ReqRaw,
  ReqTransformed,
  ResRaw,
  ResTransformed
> = CommonResolverDependencies<
  ReqRaw,
  ReqTransformed,
  ResRaw,
  ResTransformed
> & {
  dbQuery: (
    db: PgDriver
  ) => (r: ReqTransformed) => Task<DbError, Maybe<ResRaw>[]>;
  transformResult: (result: Maybe<ResRaw>[], request: ReqRaw) => ResTransformed;
};

export type SearchResolverDependencies<
  ReqRaw,
  ReqTransformed,
  ResRaw,
  ResTransformed
> = CommonResolverDependencies<
  ReqRaw,
  ReqTransformed,
  ResRaw,
  ResTransformed
> & {
  dbQuery: (db: PgDriver) => (r: ReqTransformed) => Task<DbError, ResRaw[]>;
  transformResult: (
    results: ResRaw[],
    request: ReqTransformed
  ) => ResTransformed;
};

export type RuntimeResolverDependenties = {
  db: PgDriver;
  emitEvent?: EmitEvent;
};
