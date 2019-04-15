import { identity } from 'ramda';
import { SchemaLike } from 'joi';

import { PgDriver } from '../../../../db/driver';
import { ServicePresetInitOptions } from '../../types';
import { Serializable, FromSerializable, List } from '../../../../types';
import { mget } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { transformResults as transformResultFn } from './transformResult';
import { getData } from './pg';

export const mgetByIdsPreset = <
  Id,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
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
  resultTypeFactory: (
    t?: FromSerializable<ResponseTransformed>
  ) => ResponseTransformed;
  transformResult: (
    response: ResponseRaw,
    request?: Id[]
  ) => FromSerializable<ResponseTransformed>;
  sql: (r: Id[]) => string;
  matchRequestResult: (req: Id[], res: ResponseRaw) => boolean;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  mget<PgDriver, Id[], Id[], ResponseRaw, List<ResponseTransformed>>({
    transformInput: identity,
    transformResult: transformResultFn<Id[], ResponseRaw, ResponseTransformed>(
      resultTypeFactory
    )(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult<ResponseRaw>(resultSchema, name),
    dbQuery: getData<ResponseRaw, Id>({
      name,
      sql,
      matchRequestResult,
    }),
  })({ db: pg, emitEvent });
