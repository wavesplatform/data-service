import { SchemaLike } from 'joi';

import { search } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { transformInput } from './transformInput';
import { transformResults } from './transformResult';
import { NamedType } from '../../../../types/createNamedType';
import { getData } from './pg';
import { ServicePresetInitOptions } from '../../../presets/types';
import { Cursor, SortOrder } from 'services/_common/pagination/cursor';
import { List } from '../../../../types';

export type WithSortOrder = {
  sort: SortOrder
};

export type RequestWithCursor<
  Request extends WithSortOrder,
  CursorType
> = Request & {
  after?: CursorType;
};

export type BaseResponse = {
  timestamp: Date;
  id: string;
  [key: string]: any;
};

export const searchWithPaginationPreset = <
  Request extends WithSortOrder,
  ResponseRaw,
  ResponseTransformed extends NamedType<string, BaseResponse>
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
  ) => ResponseTransformed;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  search<
    RequestWithCursor<Request, string>,
    RequestWithCursor<Request, Cursor>,
    ResponseRaw,
    List<ResponseTransformed>
  >({
    transformInput,
    transformResult: transformResults(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData<RequestWithCursor<Request, Cursor>, ResponseRaw>({
      name,
      sql,
    }),
  })({ db: pg, emitEvent });
