import { fromNullable } from 'folktale/maybe';
import { toDbError } from '../../../../errorHandling';
import { PgDriver } from '../../../../db/driver';
import { withStatementTimeout } from '../../../_common/utils';

export const getData = <ResponseRaw, Id = string>({
  name,
  sql,
  pg,
  statementTimeout,
}: {
  name: string;
  sql: (id: Id) => string;
  pg: PgDriver;
  statementTimeout: number;
}) => (id: Id) =>
  pg
    .oneOrNone<ResponseRaw>(withStatementTimeout(statementTimeout, sql(id)))
    .map(fromNullable)
    .mapRejected(e => toDbError({ request: name, params: { id } }, e.error));
