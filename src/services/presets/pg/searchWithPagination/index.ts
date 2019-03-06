import { SchemaLike } from 'joi';

import { search } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { transformInput } from './transformInput';
const transformResultFn = require('./transformResult');
import { NamedType } from '../../../../types/createNamedType';
import { getData } from './pg';
import { List } from '../../../../types';
import { ServicePresetInitOptions } from '../../../presets/types';

export const searchWithPaginationPreset = <
  RequestRaw,
  RequestTransformed,
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
  sql: (r: RequestTransformed) => string;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw[],
    request?: Request
  ) => List<ResponseTransformed>;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  search<RequestRaw, RequestTransformed, ResponseRaw, ResponseTransformed>({
    transformInput,
    transformResult: transformResultFn(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData<RequestTransformed, ResponseRaw>({ name, sql }),
  })({ db: pg, emitEvent });
