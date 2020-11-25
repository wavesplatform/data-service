import { SchemaLike } from 'joi';

import { search } from '../../../createResolver';
import { validateResult } from '../../validation';
import { RepoPresetInitOptions } from '../../types';
import { WithLimit, WithSortOrder } from '../../../../_common';
import { RequestWithCursor, CursorSerialization } from '../../../pagination';
import { transformInput } from './transformInput';
import { transformResults } from './transformResults';
import { getData } from './pg';
import { RepoSearch } from 'types';

export const searchPreset = <
  Cursor,
  Request extends RequestWithCursor<WithLimit & WithSortOrder, any>,
  ResponseRaw,
  ResponseTransformed
>({
  name,
  sql,
  resultSchema,
  transformResult,
  cursorSerialization,
}: {
  name: string;
  sql: (r: RequestWithCursor<Request, Cursor>) => string;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw,
    request?: Request
  ) => ResponseTransformed;
  cursorSerialization: CursorSerialization<
    Cursor,
    RequestWithCursor<Request, string>,
    ResponseRaw
  >;
}) => ({
  pg,
  emitEvent,
}: RepoPresetInitOptions): RepoSearch<
  RequestWithCursor<Request, string>,
  ResponseTransformed
>['search'] =>
  search<
    RequestWithCursor<Request, string>,
    RequestWithCursor<Request, Cursor>,
    ResponseRaw,
    ResponseTransformed
  >({
    transformInput: transformInput(cursorSerialization.deserialize),
    transformResult: transformResults<
      Cursor,
      RequestWithCursor<Request, string>,
      ResponseRaw,
      ResponseTransformed
    >(transformResult, cursorSerialization.serialize),
    validateResult: validateResult(resultSchema, name),
    getData: getData<Request, ResponseRaw>({
      name,
      sql,
      pg,
    }),
    emitEvent,
  });
