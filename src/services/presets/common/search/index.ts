import { identity } from 'ramda';
import { SchemaLike } from 'joi';
import { Task } from 'folktale/concurrency/task';
import { search } from '../../../_common/createResolver';
import { validateInput, validateResult } from '../../validation';
import { List, Serializable } from '../../../../types';
import { EmitEvent } from 'services/_common/createResolver/types';
import { DbError } from '../../../../errorHandling';

type CommonServicePresetInitOptions = {
  db: any;
  emitEvent: EmitEvent;
};

export const searchPreset = <
  Driver,
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
  getData: (db: Driver) => (request: Request) => Task<DbError, ResponseRaw[]>;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  transformResult: (
    response: ResponseRaw[],
    request: Request
  ) => List<ResponseTransformed>;
}) => ({ db, emitEvent }: CommonServicePresetInitOptions) =>
  search<Driver, Request, Request, ResponseRaw, List<ResponseTransformed>>({
    transformInput: identity,
    transformResult,
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData,
  })({ db, emitEvent });
