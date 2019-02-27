import { identity } from 'ramda';

import { ServicePresetInitOptions } from 'services/presets/types';
import { SchemaLike } from 'joi';
import { NamedType } from 'types/createNamedType';
import { DataType } from './transformResult';

import { mget } from '../../../_common/createResolver';

import { validateInput, validateResult } from '../../validation';
import { transformResults as transformResultFn } from './transformResult';

import { getData } from './pg';
import { List } from 'types';

export const mgetByIdPreset = <
  Request extends Array<any>,
  ResponseRaw,
  ResponseTransformed extends NamedType<string, any>
>({
  name,
  sql,
  inputSchema,
  resultSchema,
  resultTypeFactory,
  matchRequestResult,
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
  matchRequestResult: (req: Request, res: ResponseRaw) => boolean;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  mget<Request, Request, ResponseRaw, List<ResponseTransformed>>({
    transformInput: identity,
    transformResult: transformResultFn<
      Request,
      ResponseRaw,
      ResponseTransformed
    >(resultTypeFactory)(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult<ResponseRaw>(resultSchema, name),
    dbQuery: getData<Request, ResponseRaw>({
      name,
      sql,
      matchRequestResult,
    }),
  })({ db: pg, emitEvent });
