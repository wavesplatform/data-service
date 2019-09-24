import { SchemaLike } from 'joi';

import { search } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { Serializable, List } from '../../../../types';
import { ServicePresetInitOptions } from '../../../presets/types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { Cursor, RequestWithCursor } from '../../../_common/pagination';
import { transformInput } from './transformInput';
import { transformResults } from './transformResult';
import { getData } from './pg';

export const searchWithPaginationPreset = <
  Request extends WithSortOrder & WithLimit,
  ResponseRaw,
  ResponseTransformed,
  Result extends Serializable<string, ResponseTransformed | null>
>({
  name,
  sql,
  inputSchema,
  resultSchema,
  transformResult,
}: {
  name: string;
  sql: (r: RequestWithCursor<Request, Cursor>) => string;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw,
    request?: RequestWithCursor<Request, Cursor>
  ) => Result;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  search<
    RequestWithCursor<Request, string>,
    RequestWithCursor<Request, Cursor>,
    ResponseRaw,
    List<Result>
  >({
    transformInput,
    transformResult: transformResults(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    getData: getData<RequestWithCursor<Request, Cursor>, ResponseRaw>({
      name,
      sql,
      pg,
    }),
    emitEvent,
  });
