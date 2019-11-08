import { PgDriver } from '../../../../db/driver';
import { addMeta } from '../../../../errorHandling';

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
    .mapRejected(addMeta({ request: name, params: request }));
