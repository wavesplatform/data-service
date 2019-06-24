import { identity } from 'ramda';
import { SchemaLike } from 'joi';

import { ServicePresetInitOptions } from '../../types';
import { Serializable, List } from '../../../../types';
import { mget } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { transformResults as transformResultsFn } from './transformResult';
import { getData } from './pg';

export const mgetByIdsPreset = <Id, ResponseRaw, ResponseTransformed>({
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
  resultTypeFactory: (
    t?: ResponseTransformed
  ) => Serializable<string, ResponseTransformed>;
  transformResult: (
    response: ResponseRaw,
    request?: Id[]
  ) => ResponseTransformed;
  sql: (r: Id[]) => string;
  matchRequestResult: (req: Id[], res: ResponseRaw) => boolean;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  mget<
    Id[],
    Id[],
    ResponseRaw,
    List<Serializable<string, ResponseTransformed>>
  >({
    transformInput: identity,
    transformResult: transformResultsFn<
      Id[],
      ResponseRaw,
      ResponseTransformed,
      Serializable<string, ResponseTransformed>
    >(resultTypeFactory)(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult<ResponseRaw>(resultSchema, name),
    dbQuery: getData<ResponseRaw, Id>({
      name,
      sql,
      matchRequestResult,
    }),
  })({ db: pg, emitEvent });
