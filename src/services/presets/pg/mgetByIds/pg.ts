import { PgDriver } from 'db/driver';
import { assoc } from 'ramda';

import { matchRequestsResults } from '../../../../utils/db/index';

export const getData = <ResponseRaw, Id = string>({
  matchRequestResult,
  name,
  sql,
}: {
  name: string;
  sql: (req: Id[]) => string;
  matchRequestResult: (req: Id[], res: ResponseRaw) => boolean;
}) => (pg: PgDriver) => (req: Id[]) =>
  pg
    .any<ResponseRaw>(sql(req))
    .map(responses => matchRequestsResults(matchRequestResult, req, responses))
    .mapRejected(assoc('meta', { request: name, params: req }));
