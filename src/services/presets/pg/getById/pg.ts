import { fromNullable } from 'folktale/maybe';
import { PgDriver } from 'db/driver';
import { assoc } from 'ramda';

export const getData = <ResponseRaw, Id = string>({
  name,
  sql,
}: {
  name: string;
  sql: (id: Id) => string;
}) => (pg: PgDriver) => (id: Id) =>
  pg
    .oneOrNone<ResponseRaw>(sql(id))
    .map(fromNullable)
    .mapRejected(assoc('meta', { request: name, params: id }));
