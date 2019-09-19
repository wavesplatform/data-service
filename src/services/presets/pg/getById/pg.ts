import { fromNullable } from 'folktale/maybe';
import { toDbError } from '../../../../errorHandling';

import { PgDriver } from '../../../../db/driver';

export const getData = <ResponseRaw, Id = string>({
  name,
  sql,
  pg,
}: {
  name: string;
  sql: (id: Id) => string;
  pg: PgDriver;
}) => (id: Id) =>
  pg
    .oneOrNone<ResponseRaw>(sql(id))
    .map(fromNullable)
    .mapRejected(e => toDbError({ request: name, params: { id } }, e.error));
