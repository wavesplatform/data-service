import { identity } from 'ramda';
import { SchemaLike } from 'joi';
import { Maybe } from 'folktale/maybe';
import { Task } from 'folktale/concurrency/task';
import { get } from '../../../_common/createResolver';
import { EmitEvent } from '../../../_common/createResolver/types';
import { validateInput, validateResult } from '../../validation';
import { Serializable } from '../../../../types';
import { DbError } from '../../../../errorHandling';

type CommonServicePresetInitOptions = {
  emitEvent: EmitEvent;
};

export const getPreset = <
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
  getData: (request: Request) => Task<DbError, Maybe<ResponseRaw>>;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (
    response: Maybe<ResponseRaw>,
    request: Request
  ) => Maybe<ResponseTransformed>;
}) => ({ emitEvent }: CommonServicePresetInitOptions) =>
  get<Request, Request, ResponseRaw, ResponseTransformed>({
    transformInput: identity,
    transformResult,
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    getData,
  })({ emitEvent });
