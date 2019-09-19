import { PgDriver } from '../../../../db/driver';
import { toDbError } from '../../../../errorHandling';

export const getData = <Request, ResponseRaw>({
  name,
  sql,
  pg,
}: {
  name: string;
  sql: (req: Request) => string;
  pg: PgDriver;
}) => (filters: Request) =>
  pg
    .any<ResponseRaw>(sql(filters))
    .mapRejected(e => toDbError({ request: name, params: filters }, e.error));
