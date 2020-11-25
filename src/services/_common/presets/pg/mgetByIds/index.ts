import { Ok as ok } from 'folktale/result';
import { SchemaLike } from 'joi';

import { RepoPresetInitOptions } from '../../types';
import { mget } from '../../../createResolver';
import { validateResult } from '../../validation';
import { transformResults as transformResultsFn } from './transformResult';
import { getData } from './pg';

export const mgetByIdsPreset = <Id, ResponseRaw, ResponseTransformed>({
  name,
  sql,
  resultSchema,
  matchRequestResult,
  transformResult,
}: {
  name: string;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw,
    request?: Id[]
  ) => ResponseTransformed;
  sql: (r: Id[]) => string;
  matchRequestResult: (req: Id[], res: ResponseRaw) => boolean;
}) => ({ pg, emitEvent }: RepoPresetInitOptions) =>
  mget<Id[], Id[], ResponseRaw, ResponseTransformed>({
    transformInput: ok,
    transformResult: transformResultsFn<Id[], ResponseRaw, ResponseTransformed>(
      transformResult
    ),
    validateResult: validateResult<ResponseRaw>(resultSchema, name),
    getData: getData<ResponseRaw, Id>({
      name,
      sql,
      matchRequestResult,
      pg,
    }),
    emitEvent,
  });
