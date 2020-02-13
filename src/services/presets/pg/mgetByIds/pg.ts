import { Task, of as task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';
import { PgDriver } from '../../../../db/driver';
import { matchRequestsResults } from '../../../../utils/db';
import { DbError, Timeout, addMeta } from '../../../../errorHandling';

import { isEmpty } from 'ramda';

export const getData = <ResponseRaw, Id = string>({
  matchRequestResult,
  name,
  sql,
  pg,
}: {
  name: string;
  sql: (req: Id[]) => string;
  matchRequestResult: (req: Id, res: ResponseRaw) => boolean;
  pg: PgDriver;
}) => (req: Id[]): Task<DbError | Timeout, Maybe<ResponseRaw>[]> =>
  isEmpty(req)
    ? task([])
    : pg
        .any<ResponseRaw>(sql(req))
        .map(responses => matchRequestsResults(matchRequestResult, req, responses))
        .mapRejected(addMeta({ request: name, params: req }));
