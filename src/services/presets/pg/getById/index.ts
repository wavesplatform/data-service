import { identity } from 'ramda';
import { SchemaLike } from 'joi';

import { get } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { transformResults as transformResultFn } from './transformResult';
import { getData } from './pg';
import { ServicePresetInitOptions, DataType } from '../../types';
import { NamedType } from '../../../../types/createNamedType';

export const getByIdPreset = <
  Id,
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
    request?: Id
  ) => DataType<ResponseTransformed>;
  sql: (r: Id) => string;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  get<Id, Id, ResponseRaw, ResponseTransformed>({
    transformInput: identity,
    transformResult: transformResultFn<Id, ResponseRaw, ResponseTransformed>(
      resultTypeFactory
    )(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData({ name, sql }),
  })({ db: pg, emitEvent });
