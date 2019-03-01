import { PgDriver } from 'db/driver';
import { assoc } from 'ramda';

export const getData = <Request, ResponseRaw>({
  name,
  sql,
}: {
  name: string;
  sql: (req: Request) => string;
}) => (pg: PgDriver) => (filters: Request) =>
  pg
    .any<ResponseRaw>(sql(filters))
    .mapRejected(assoc('meta', { request: name, params: filters }));
