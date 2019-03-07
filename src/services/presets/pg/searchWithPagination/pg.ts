import { assoc } from 'ramda';

import { PgDriver } from '../../../../db/driver';

export const getData = <Request, ResponseRaw>({
  name,
  sql,
}: {
  name: string;
  sql: (req: Request) => string;
}) => (pg: PgDriver) => (request: Request) =>
  pg
    .any<ResponseRaw>(sql(request))
    .mapRejected(assoc('meta', { request: name, params: request }));
