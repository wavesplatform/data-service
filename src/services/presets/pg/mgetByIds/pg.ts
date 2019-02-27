import { PgDriver } from 'db/driver';
import { assoc } from 'ramda';

import { matchRequestsResults } from '../../../../utils/db/index';

export const getData = <Request extends Array<any>, ResponseRaw>({
  matchRequestResult,
  name,
  sql,
}: {
  name: string;
  sql: (req: Request) => string;
  matchRequestResult: (req: Request, res: ResponseRaw) => boolean;
}) => (pg: PgDriver) => (req: Request) =>
  pg
    .any<ResponseRaw>(sql(req))
    .map(responses => matchRequestsResults(matchRequestResult, req, responses))
    .mapRejected(assoc('meta', { request: name, params: req }));
