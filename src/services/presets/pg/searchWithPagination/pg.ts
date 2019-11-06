import { toDbError } from '../../../../errorHandling';
import { PgDriver } from '../../../../db/driver';
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
}) => (request: Request) =>
  pg
    .any<ResponseRaw>(withStatementTimeout(statementTimeout, sql(request)))
    .mapRejected(e => toDbError({ request: name, params: request }, e.error));
