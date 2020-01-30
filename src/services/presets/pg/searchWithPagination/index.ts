import { SchemaLike } from 'joi';

import { search } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { Serializable, List } from '../../../../types';
import { ServicePresetInitOptions } from '../../../presets/types';
import { WithLimit } from '../../../_common';
import {
  RequestWithCursor,
  CursorSerialization,
} from '../../../_common/pagination';
import { transformInput } from './transformInput';
import { transformResults } from './transformResult';
import { getData } from './pg';

export const searchWithPaginationPreset = <
  Cursor,
  Request extends RequestWithCursor<WithLimit, any>,
  ResponseRaw,
  ResponseTransformed,
  Res extends Serializable<string, ResponseTransformed | null>
>({
  name,
  sql,
  inputSchema,
  resultSchema,
  transformResult,
  cursorSerialization,
}: {
  name: string;
  sql: (r: Request) => string;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (response: ResponseRaw, request?: Request) => Res;
  cursorSerialization: CursorSerialization<
    Cursor,
    RequestWithCursor<Request, Cursor>,
    ResponseRaw
  >;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  search<
    RequestWithCursor<Request, string>,
    RequestWithCursor<Request, Cursor>,
    ResponseRaw,
    List<Res>
  >({
    transformInput: transformInput(cursorSerialization.deserialize),
    transformResult: transformResults<Cursor, Request, ResponseRaw, Res>(
      transformResult,
      cursorSerialization.serialize
    ),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    getData: getData<Request, ResponseRaw>({
      name,
      sql,
      pg,
    }),
    emitEvent,
  });
