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
}) => (filters: Request) =>
  pg
    .any<ResponseRaw>(sql(filters))
    .mapRejected(pgErrorMatching({ request: name, params: filters }));
