import { of as taskOf, Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';

// @hack because of ramda 'tap' not working with null values
// https://github.com/ramda/ramda/issues/2421
// @todo refactor after ramda fix
import { tap } from '../../../utils/tap';

import { resultToTask } from '../../../utils/fp/';

import { applyValidation } from './applyToResult';
export { applyTransformation } from './applyToResult';

import { ResolverError, DbError, AppError } from '../../../errorHandling/';

import {
  EmitEvent,
  GetResolverDependencies,
  MgetResolverDependencies,
  SearchResolverDependencies,
  ValidateSync,
  ValidateAsync,
} from './types';

const createResolver = <
  RequestRaw,
  RequestTransformed,
  ResponseRaw,
  ResponseTransformed
>(
  validateInput: ValidateAsync<AppError, RequestRaw>,
  transformInput: (r: RequestRaw) => RequestTransformed,
  getData: (r: RequestTransformed) => Task<DbError, ResponseRaw>,
  validateAllResults: ValidateSync<ResolverError, ResponseRaw>,
  transformAllResults: (
    response: ResponseRaw,
    request: RequestRaw
  ) => ResponseTransformed,
  emitEvent: EmitEvent,
  request: RequestRaw
): Task<AppError, ResponseTransformed> =>
  taskOf<never, RequestRaw>(request)
    .chain(validateInput)
    .map(tap(emitEvent('INPUT_VALIDATION_OK')))
    .map(transformInput)
    .map(tap(emitEvent('TRANSFORM_INPUT_OK')))
    .chain(getData)
    .map(tap(emitEvent('DB_QUERY_OK')))
    .map(validateAllResults)
    .chain(resultToTask)
    .map(tap(emitEvent('RESULT_VALIDATION_OK')))
    .map((result: ResponseRaw) => transformAllResults(result, request))
    .map(tap(emitEvent('TRANSFORM_RESULT_OK')));

const getResolver = <
  RequestRaw,
  RequestTransformed,
  ResponseRaw,
  ResponseTransformed
>(
  dependencies: GetResolverDependencies<
    RequestRaw,
    RequestTransformed,
    ResponseRaw,
    ResponseTransformed
  >
) => (request: RequestRaw) =>
  createResolver<
    RequestRaw,
    RequestTransformed,
    Maybe<ResponseRaw>,
    Maybe<ResponseTransformed>
  >(
    dependencies.validateInput,
    dependencies.transformInput,
    dependencies.getData,
    applyValidation.get(dependencies.validateResult),
    result => dependencies.transformResult(result, request),
    dependencies.emitEvent,
    request
  );

const mgetResolver = <
  RequestRaw,
  RequestTransformed,
  ResponseRaw,
  ResponseTransformed
>(
  dependencies: MgetResolverDependencies<
    RequestRaw,
    RequestTransformed,
    ResponseRaw,
    ResponseTransformed
  >
) => (request: RequestRaw) =>
  createResolver<
    RequestRaw,
    RequestTransformed,
    Maybe<ResponseRaw>[],
    ResponseTransformed
  >(
    dependencies.validateInput,
    dependencies.transformInput,
    dependencies.getData,
    applyValidation.mget(dependencies.validateResult),
    result => dependencies.transformResult(result, request),
    dependencies.emitEvent,
    request
  );

const searchResolver = <
  RequestRaw,
  RequestTransformed,
  ResponseRaw,
  ResponseTransformed
>(
  dependencies: SearchResolverDependencies<
    RequestRaw,
    RequestTransformed,
    ResponseRaw,
    ResponseTransformed
  >
) => (request: RequestRaw) =>
  createResolver<
    RequestRaw,
    RequestTransformed,
    ResponseRaw[],
    ResponseTransformed
  >(
    dependencies.validateInput,
    dependencies.transformInput,
    dependencies.getData,
    applyValidation.search(dependencies.validateResult),
    result =>
      dependencies.transformResult(
        result,
        dependencies.transformInput(request)
      ),
    dependencies.emitEvent,
    request
  );

export const get = getResolver;
export const mget = mgetResolver;
export const search = searchResolver;
