import { identity } from 'ramda';

import { ServicePresetInitOptions } from 'services/presets/types';
import { SchemaLike } from 'joi';
import { NamedType } from 'types/createNamedType';
import { DataType } from '../../types';

import { mget } from '../../../_common/createResolver';

import { validateInput, validateResult } from '../../validation';
import { transformResults as transformResultFn } from './transformResult';

import { getData } from './pg';
import { List } from 'types';

export const mgetByIdsPreset = <
  Id,
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
    request?: Id[]
  ) => DataType<ResponseTransformed>;
  sql: (r: Id[]) => string;
  matchRequestResult: (req: Id[], res: ResponseRaw) => boolean;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  mget<Id[], Id[], ResponseRaw, List<ResponseTransformed>>({
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
