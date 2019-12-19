import { identity } from 'ramda';
import { SchemaLike } from 'joi';

import { ServicePresetInitOptions } from '../../types';
import { mget } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { transformResults as transformResultsFn } from './transformResult';
import { getData } from './pg';

export const mgetByIdsPreset = <Id, ResponseRaw, ResponseTransformed>({
  name,
  sql,
  inputSchema,
  resultSchema,
  matchRequestResult,
  transformResult,
}: {
  name: string;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw,
    request?: Id[]
  ) => ResponseTransformed;
  sql: (r: Id[]) => string;
  matchRequestResult: (req: Id[], res: ResponseRaw) => boolean;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  mget<Id[], Id[], ResponseRaw, ResponseTransformed | null>({
    transformInput: identity,
    transformResult: transformResultsFn<Id[], ResponseRaw, ResponseTransformed>(
      transformResult
    ),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult<ResponseRaw>(resultSchema, name),
    getData: getData<ResponseRaw, Id>({
      name,
      sql,
      matchRequestResult,
      pg,
    }),
    emitEvent,
  });
