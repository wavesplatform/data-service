import { SchemaLike } from 'joi';
import { Task } from 'folktale/concurrency/task';
import { identity } from 'ramda';

import { AppError } from '../../../../errorHandling';
import { search } from '../../../_common/createResolver';
import { ServicePresetInitOptions } from '../../../presets/types';
import { validateInput, validateResult } from '../../validation';
import { getData } from './pg';

export const searchPreset = <Request, ResponseRaw, ResponseTransformed>({
  name,
  sql,
  inputSchema,
  resultSchema,
  transformResult,
}: {
  name: string;
  sql: (r: Request) => string;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw[],
    request: Request
  ) => ResponseTransformed[];
}) => ({
  pg,
  emitEvent,
}: ServicePresetInitOptions): ((
  request: Request
) => Task<AppError, ResponseTransformed[]>) =>
  search<Request, Request, ResponseRaw, ResponseTransformed>({
    transformInput: identity,
    transformResult,
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    getData: getData({ name, sql, pg }),
    emitEvent,
  });
