import { SchemaLike } from 'joi';
import { Result } from 'folktale/result';

import { search } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { Serializable, List } from '../../../../types';
import { ServicePresetInitOptions } from '../../../presets/types';
import { WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { transformInput } from './transformInput';
import { transformResults } from './transformResult';
import { getData } from './pg';
import { ValidationError } from '../../../../errorHandling';

export const searchWithPaginationPreset = <
  Cursor,
  Request extends WithLimit,
  ResponseRaw,
  ResponseTransformed,
  Res extends Serializable<string, ResponseTransformed | null>
>({
  name,
  sql,
  inputSchema,
  resultSchema,
  transformResult,
  cursor,
}: {
  name: string;
  sql: (r: RequestWithCursor<Request, Cursor>) => string;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw,
    request?: RequestWithCursor<Request, Cursor>
  ) => Res;
  cursor: {
    encode: (request: Request, response: Res) => string | undefined;
    decode: (cursor: string) => Result<ValidationError, Cursor>;
  };
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  search<
    RequestWithCursor<Request, string>,
    RequestWithCursor<Request, Cursor>,
    ResponseRaw,
    List<Res>
  >({
    transformInput: transformInput(cursor.decode),
    transformResult: transformResults<
      Cursor,
      RequestWithCursor<Request, Cursor>,
      ResponseRaw,
      Res
    >(transformResult, cursor.encode),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    getData: getData<RequestWithCursor<Request, Cursor>, ResponseRaw>({
      name,
      sql,
      pg,
    }),
    emitEvent,
  });
