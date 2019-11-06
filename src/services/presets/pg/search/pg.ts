import { PgDriver } from '../../../../db/driver';
import { toDbError } from '../../../../errorHandling';
import { withStatementTimeout } from '../../../_common/utils';

export const getData = <Request, ResponseRaw>({
  name,
  sql,
  pg,
  statementTimeout,
}: {
  name: string;
  sql: (req: Request) => string;
  pg: PgDriver;
  statementTimeout: number;
}) => (filters: Request) =>
  pg
    .any<ResponseRaw>(withStatementTimeout(statementTimeout, sql(filters)))
    .mapRejected(e => toDbError({ request: name, params: filters }, e.error));
