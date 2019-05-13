import { identity } from 'ramda';
import { SchemaLike } from 'joi';

import { PgDriver } from '../../../../db/driver';
import { get } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { transformResults as transformResultFn } from './transformResult';
import { getData } from './pg';
import { ServicePresetInitOptions } from '../../types';
import { Serializable, FromSerializable } from '../../../../types';

export const getByIdPreset = <
  Id,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
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
  resultTypeFactory: (
    t: FromSerializable<ResponseTransformed>
  ) => ResponseTransformed;
  transformResult: (
    response: ResponseRaw,
    request?: Id
  ) => FromSerializable<ResponseTransformed>;
  sql: (r: Id) => string;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  get<Id, Id, ResponseRaw, ResponseTransformed>({
    transformInput: identity,
    transformResult: transformResultFn<Id, ResponseRaw, ResponseTransformed>(
      resultTypeFactory
    )(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    getData: getData({ name, sql })(pg),
  })({ pg, emitEvent });
