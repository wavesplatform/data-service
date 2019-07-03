import { identity } from 'ramda';
import { SchemaLike } from 'joi';

import { get } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { transformResults as transformResultFn } from './transformResult';
import { getData } from './pg';
import { ServicePresetInitOptions } from '../../types';
import { Serializable } from '../../../../types';

export const getByIdPreset = <Id, ResponseRaw, ResponseTransformed>({
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
  resultTypeFactory: (
    t?: ResponseTransformed
  ) => Serializable<string, ResponseTransformed>;
  transformResult: (response: ResponseRaw, request?: Id) => ResponseTransformed;
  sql: (r: Id) => string;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  get<Id, Id, ResponseRaw, Serializable<string, ResponseTransformed>>({
    transformInput: identity,
    transformResult: transformResultFn<
      Id,
      ResponseRaw,
      ResponseTransformed,
      Serializable<string, ResponseTransformed>
    >(resultTypeFactory)(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData({ name, sql }),
  })({ db: pg, emitEvent });
