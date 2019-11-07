import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';
import { PgDriver } from '../../db/driver';
import { matchRequestsResults } from '../../utils/db';
import { toDbError, DbError } from '../../errorHandling';
import { MgetRequest } from './types';

export const mgetPairsPg = <Request extends MgetRequest, ResponseRaw, Id>({
  matchRequestResult,
  name,
  sql,
  pg,
}: {
  name: string;
  sql: (request: Request) => string;
  matchRequestResult: (req: Id[], res: ResponseRaw) => boolean;
  pg: PgDriver;
}) => (request: Request): Task<DbError, Maybe<ResponseRaw>[]> =>
  pg
    .any<ResponseRaw>(sql(request))
    .map(responses =>
      matchRequestsResults(matchRequestResult, request.pairs, responses)
    )
    .mapRejected((e: DbError) =>
      toDbError({ request: name, params: request }, e.error)
    );
