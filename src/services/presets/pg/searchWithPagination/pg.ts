import { toDbError } from '../../../../errorHandling';
import { PgDriver } from '../../../../db/driver';

export const getData = <Request, ResponseRaw>({
  name,
  sql,
  pg,
}: {
  name: string;
  sql: (req: Request) => string;
  pg: PgDriver;
}) => (request: Request) =>
  pg
    .any<ResponseRaw>(sql(request))
    .mapRejected(e => toDbError({ request: name, params: request }, e.error));
