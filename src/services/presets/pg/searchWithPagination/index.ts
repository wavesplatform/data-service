import { SchemaLike } from 'joi';

import { search } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { transformInput } from './transformInput';
import { transformResults } from './transformResult';
import { NamedType } from '../../../../types/createNamedType';
import { getData } from './pg';
import { ServicePresetInitOptions } from '../../../presets/types';
import {
  Cursor,
  SortAscend,
  SortDescend,
} from 'services/_common/pagination/cursor';
import { List } from '../../../../types';

export type RequestRaw<Request> = Request & {
  after?: string;
  sort: SortAscend | SortDescend;
};
export type RequestTransformed<Request> = Request & {
  after?: Cursor;
  sort: SortAscend | SortDescend;
};

export const searchWithPaginationPreset = <
  Request,
  ResponseRaw,
  ResponseTransformed extends NamedType<string, any>
>({
  name,
  sql,
  inputSchema,
  resultSchema,
  transformResult,
}: {
  name: string;
  sql: (r: RequestTransformed<Request>) => string;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw,
    request?: RequestTransformed<Request>
  ) => ResponseTransformed;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  search<
    RequestRaw<Request>,
    RequestTransformed<Request>,
    ResponseRaw,
    List<ResponseTransformed>
  >({
    transformInput,
    transformResult: transformResults(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData<RequestTransformed<Request>, ResponseRaw>({ name, sql }),
  })({ db: pg, emitEvent });
