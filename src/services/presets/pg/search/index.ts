import { identity } from 'ramda';
import { SchemaLike } from 'joi';

import { getData } from './pg';
import { search } from '../../../_common/createResolver';
import { ServicePresetInitOptions } from '../../../presets/types';
import { validateInput, validateResult } from '../../validation';
import { List, Serializable } from '../../../../types';

export const searchPreset = <
  Request,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
>({
  name,
  sql,
  inputSchema,
  resultSchema,
  transformResult,
}: {
  name: string;
  sql: (r: Request) => string;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw[],
    request?: Request
  ) => List<ResponseTransformed>;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  search<Request, Request, ResponseRaw, List<ResponseTransformed>>({
    transformInput: identity,
    transformResult,
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    getData: getData<Request, ResponseRaw>({ name, sql })(pg),
  })({ emitEvent });
