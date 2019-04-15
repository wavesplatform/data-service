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
import { BalancesClient } from '../../../protobuf/balances_grpc_pb';

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
  DbDriver,
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
    db: DbDriver
  ) => (r: ReqTransformed) => Task<DbError, Maybe<ResRaw>>;
  transformResult: (
    result: Maybe<ResRaw>,
    request: ReqRaw
  ) => Maybe<ResTransformed>;
};

export type MgetResolverDependencies<
  DbDriver,
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
    db: DbDriver
  ) => (r: ReqTransformed) => Task<DbError, Maybe<ResRaw>[]>;
  transformResult: (result: Maybe<ResRaw>[], request: ReqRaw) => ResTransformed;
};

export type SearchResolverDependencies<
  DbDriver,
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
  dbQuery: (db: DbDriver) => (r: ReqTransformed) => Task<DbError, ResRaw[]>;
  transformResult: (
    results: ResRaw[],
    request: ReqTransformed
  ) => ResTransformed;
};

export type RuntimeResolverDependenties<DbDriver> = {
  db: DbDriver;
  emitEvent?: EmitEvent;
};
