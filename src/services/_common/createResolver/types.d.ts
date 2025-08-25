import { Task } from 'folktale/concurrency/task';
import { Result } from 'folktale/result';
import { Maybe } from 'folktale/maybe';
import { ValidationError, ResolverError, DbError, Timeout } from '../../../errorHandling';

import { SearchedItems } from '../../../types';

export type EmitEvent = (name: string) => <A>(object: A) => void;

export type ValidateSync<Error, Value> = (value: Value) => Result<Error, Value>;
export type ValidateAsync<Error, Value> = (value: Value) => Task<Error, Value>;

type CommonResolverDependencies<ReqRaw, ReqTransformed, ResRaw> = {
  transformInput: (r: ReqRaw) => Result<ValidationError, ReqTransformed>;
  validateResult: ValidateSync<ResolverError, ResRaw>;
  emitEvent: EmitEvent;
};

export type GetResolverDependencies<ReqRaw, ReqTransformed, ResRaw, ResTransformed> =
  CommonResolverDependencies<ReqRaw, ReqTransformed, ResRaw> & {
    getData: (r: ReqTransformed) => Task<DbError | Timeout, Maybe<ResRaw>>;
    transformResult: (result: Maybe<ResRaw>, request: ReqRaw) => Maybe<ResTransformed>;
  };

export type MgetResolverDependencies<ReqRaw, ReqTransformed, ResRaw, ResTransformed> =
  CommonResolverDependencies<ReqRaw, ReqTransformed, ResRaw> & {
    getData: (r: ReqTransformed) => Task<DbError | Timeout, Maybe<ResRaw>[]>;
    transformResult: (
      result: Maybe<ResRaw>[],
      request: ReqRaw
    ) => Maybe<ResTransformed>[];
  };

export type SearchResolverDependencies<ReqRaw, ReqTransformed, ResRaw, ResTransformed> =
  CommonResolverDependencies<ReqRaw, ReqTransformed, ResRaw> & {
    getData: (r: ReqTransformed) => Task<DbError | Timeout, ResRaw[]>;
    transformResult: (
      results: ResRaw[],
      request: ReqRaw
    ) => SearchedItems<ResTransformed>;
  };
