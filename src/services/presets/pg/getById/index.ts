import { identity } from 'ramda';
import { SchemaLike } from 'joi';

import { get } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { transformResults as transformResultFn } from './transformResult';
import { getData } from './pg';
import { ServicePresetInitOptions } from '../../types';
import { Serializable } from '../../../../types';

export const getByIdPreset = <
  Id,
  ResponseRaw,
  ResponseTransformed,
  Result extends Serializable<string, ResponseTransformed | null>
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
  resultTypeFactory: (t: ResponseTransformed) => Result;
  transformResult: (response: ResponseRaw, request?: Id) => ResponseTransformed;
  sql: (r: Id) => string;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  get<Id, Id, ResponseRaw, Result>({
    transformInput: identity,
    transformResult: transformResultFn<
      Id,
      ResponseRaw,
      ResponseTransformed,
      Result
    >(resultTypeFactory)(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    getData: getData({ name, sql, pg }),
    emitEvent,
  });
