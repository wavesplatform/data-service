import { identity } from 'ramda';
import { SchemaLike } from 'joi';
import { Task } from 'folktale/concurrency/task';

import { getData } from './pg';
import { search } from '../../../_common/createResolver';
import { ServicePresetInitOptions } from '../../../presets/types';
import { validateInput, validateResult } from '../../validation';
import { List, Serializable } from '../../../../types';
import { AppError } from 'errorHandling';

export const searchPreset = <
  Request,
  ResponseRaw,
  ResponseTransformed,
  Result extends List<Serializable<string, ResponseTransformed | null>>
>({
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
  transformResult: (response: ResponseRaw[], request: Request) => Result;
}) => ({
  pg,
  emitEvent,
}: ServicePresetInitOptions): ((request: Request) => Task<AppError, Result>) =>
  search<Request, Request, ResponseRaw, Result>({
    transformInput: identity,
    transformResult,
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData({ name, sql }),
  })({ db: pg, emitEvent });
