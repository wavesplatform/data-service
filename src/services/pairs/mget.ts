import { identity } from 'ramda';

import { mget } from '../_common/createResolver';
import { ServicePresetInitOptions } from '../presets/types';
import { Serializable, List } from '../../types';
import { validateInput, validateResult } from '../presets/validation';
import { transformResults as transformResultsFn } from './transformResults';

import { inputMget, result as resultSchema } from './schema';
import { mgetPairs } from './pg';
import * as matchRequestResult from './matchRequestResult';
import { Pair, MgetRequest } from './types';

export default <Request extends MgetRequest, ResponseRaw, ResponseTransformed>({
  name,
  sql,
  transformResult,
  typeFactory,
}: {
  name: string;
  sql: (req: Request) => string;
  transformResult: (
    results: ResponseRaw,
    request?: Request
  ) => ResponseTransformed;
  typeFactory: (
    d?: ResponseTransformed | undefined
  ) => Serializable<string, ResponseTransformed>;
}) => ({ pg, emitEvent }: ServicePresetInitOptions) =>
  mget<
    Request,
    Request,
    ResponseRaw,
    List<Serializable<string, ResponseTransformed>>
  >({
    transformInput: identity,
    transformResult: transformResultsFn<
      Request,
      ResponseRaw,
      ResponseTransformed,
      Serializable<string, ResponseTransformed>
    >(typeFactory)(transformResult),
    validateInput: validateInput(inputMget, name),
    validateResult: validateResult<ResponseRaw>(resultSchema, name),
    dbQuery: mgetPairs<Request, ResponseRaw, Pair>({
      name,
      sql,
      matchRequestResult,
    }),
  })({ db: pg, emitEvent });
