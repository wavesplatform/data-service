import { identity } from 'ramda';
import { SchemaLike } from 'joi';
import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';

import { EmitEvent } from '../../../_common/createResolver/types';
import { mget } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { List, FromSerializable, Serializable } from '../../../../types';
import { DbError } from '../../../../errorHandling';
import { transformResults as transformResultFn } from './transformResult';

type CommonServicePresetInitOptions = {
  emitEvent: EmitEvent;
};

export const mgetPreset = <
  Id,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
>({
  name,
  getData,
  inputSchema,
  resultSchema,
  resultTypeFactory,
  transformResult,
}: {
  name: string;
  getData: (ids: Id[]) => Task<DbError, Maybe<ResponseRaw>[]>;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  resultTypeFactory: (
    t?: FromSerializable<ResponseTransformed>
  ) => ResponseTransformed;
  transformResult: (
    response: ResponseRaw,
    request?: Id[]
  ) => FromSerializable<ResponseTransformed>;
}) => ({ emitEvent }: CommonServicePresetInitOptions) =>
  mget<Id[], Id[], ResponseRaw, List<ResponseTransformed>>({
    transformInput: identity,
    transformResult: transformResultFn<Id[], ResponseRaw, ResponseTransformed>(
      resultTypeFactory
    )(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    getData,
  })({ emitEvent });
