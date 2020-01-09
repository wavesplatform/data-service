import { SchemaLike } from 'joi';

import { search } from '../../../createResolver';
import { validateResult } from '../../validation';
import { RepoPresetInitOptions } from '../../types';
import { WithLimit } from '../../../../_common';
import { RequestWithCursor, CursorSerialization } from '../../../pagination';
import { transformInput } from './transformInput';
import { transformResults } from './transformResults';
import { getData } from './pg';
import { RepoSearch } from 'types';

export const searchPreset = <
  Cursor,
  Request extends WithLimit,
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
    request?: RequestWithCursor<Request, Cursor>
  ) => ResponseTransformed;
  cursorSerialization: CursorSerialization<
    Cursor,
    Request,
    ResponseTransformed
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
      RequestWithCursor<Request, Cursor>,
      ResponseRaw,
      ResponseTransformed
    >(transformResult, cursorSerialization.serialize),
    validateResult: validateResult(resultSchema, name),
    getData: getData<RequestWithCursor<Request, Cursor>, ResponseRaw>({
      name,
      sql,
      pg,
    }),
    emitEvent,
  });
