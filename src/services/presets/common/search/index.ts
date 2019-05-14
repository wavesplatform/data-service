import { identity } from 'ramda';
import { SchemaLike } from 'joi';
import { Task } from 'folktale/concurrency/task';
import { search } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { List, Serializable } from '../../../../types';
import { EmitEvent } from 'services/_common/createResolver/types';
import { DbError } from '../../../../errorHandling';

type CommonServicePresetInitOptions = {
  emitEvent: EmitEvent;
};

export const searchPreset = <
  Request,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
>({
  name,
  getData,
  inputSchema,
  resultSchema,
  transformResult,
}: {
  name: string;
  getData: (request: Request) => Task<DbError, ResponseRaw[]>;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw[],
    request: Request
  ) => List<ResponseTransformed>;
}) => ({ emitEvent }: CommonServicePresetInitOptions) =>
  search<Request, Request, ResponseRaw, List<ResponseTransformed>>({
    transformInput: identity,
    transformResult,
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    getData,
  })({ emitEvent });
