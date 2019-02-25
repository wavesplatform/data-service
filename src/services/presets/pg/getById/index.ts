import { identity } from 'ramda';
import { SchemaLike } from 'joi';

import { get } from '../../../_common/createResolver';

import { validateInput, validateResult } from '../../validation';
import {
  transformResults as transformResultFn,
  DataType,
} from './transformResult';

import { getData } from './pg';
import { ServicePresetInitOptions } from 'services/presets/types';
import { NamedType } from 'types/createNamedType';

export const getByIdPreset = <
  Request,
  ResponseRaw,
  ResponseTransformed extends NamedType<string, any>
>({
  name,
  sql,
  inputSchema,
  resultSchema,
  resultTypeFactory,
  transformResult,
}: {
  name: string;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  resultTypeFactory: (t?: DataType<ResponseTransformed>) => ResponseTransformed;
  transformResult: (
    response: ResponseRaw,
    request?: Request
  ) => DataType<ResponseTransformed>;
  sql: (r: Request) => string;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  get<Request, Request, ResponseRaw, ResponseTransformed>({
    transformInput: identity,
    transformResult: transformResultFn<
      Request,
      ResponseRaw,
      ResponseTransformed
    >(resultTypeFactory)(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData({ name, sql }),
  })({ db: pg, emitEvent });
