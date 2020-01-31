import { Ok as ok } from 'folktale/result';
import { SchemaLike } from 'joi';

import { get as getResolver } from '../../../createResolver';
import { validateResult } from '../../validation';
import { transformResults as transformResultFn } from './transformResult';
import { getData } from './pg';
import { RepoPresetInitOptions } from '../../types';

export const getByIdPreset = <Id, ResponseRaw, ResponseTransformed>({
  name,
  sql,
  resultSchema,
  transformResult,
}: {
  name: string;
  resultSchema: SchemaLike;
  transformResult: (response: ResponseRaw, request?: Id) => ResponseTransformed;
  sql: (r: Id) => string;
}) => ({ pg, emitEvent }: RepoPresetInitOptions) =>
  getResolver<Id, Id, ResponseRaw, ResponseTransformed>({
    transformInput: ok,
    transformResult: transformResultFn<Id, ResponseRaw, ResponseTransformed>(
      transformResult
    ),
    validateResult: validateResult(resultSchema, name),
    getData: getData({ name, sql, pg }),
    emitEvent,
  });
