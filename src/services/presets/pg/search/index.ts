import { identity } from 'ramda';
import { getData } from './pg';
import { search } from '../../../_common/createResolver';
import { ServicePresetInitOptions } from '../../../presets/types';
import { SchemaLike } from 'joi';
import { validateInput, validateResult } from '../../validation';
import { NamedType } from '../../../../types/createNamedType';
import { List } from '../../../../types';

export const searchPreset = <
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
    dbQuery: getData({ name, sql }),
  })({ db: pg, emitEvent });
