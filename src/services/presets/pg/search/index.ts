import { SchemaLike } from 'joi';
import { Task } from 'folktale/concurrency/task';
import { identity } from 'ramda';

import { AppError } from '../../../../errorHandling';
import { List, Serializable } from '../../../../types';
import { search } from '../../../_common/createResolver';
import { ServicePresetInitOptions } from '../../../presets/types';
import { validateInput, validateResult } from '../../validation';
import { getData } from './pg';

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
    getData: getData({ name, sql, pg }),
    emitEvent,
  });
