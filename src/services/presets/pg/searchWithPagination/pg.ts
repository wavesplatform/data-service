import { PgDriver } from '../../../../db/driver';
import { pgErrorMatching } from '../../../_common/utils';

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
    .mapRejected(pgErrorMatching({ request: name, params: request }));
