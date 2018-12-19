import { Task } from 'folktale/concurrency/task';
import { Result } from 'folktale/result';
import { Maybe } from 'folktale/maybe';
import {
  ValidationError,
  ResolverError,
  DbError,
  AppError,
} from 'errorHandling';

// @todo type DbDriver
export type DbDriver = any;
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
    db: DbDriver
  ) => (r: ReqTransformed) => Task<DbError, Maybe<ResRaw>>;
  transformResult: (result: Maybe<ResRaw>, request: ReqRaw) => ResTransformed;
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
    db: DbDriver
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
  dbQuery: (db: DbDriver) => (r: ReqTransformed) => Task<DbError, ResRaw[]>;
  transformResult: (results: ResRaw[], request: ReqRaw) => ResTransformed;
};

export type RuntimeResolverDependenties = {
  db: DbDriver;
  emitEvent?: EmitEvent;
};
