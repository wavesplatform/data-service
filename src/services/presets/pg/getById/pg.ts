import { fromNullable } from 'folktale/maybe';
import { PgDriver } from 'db/driver';
import { assoc } from 'ramda';

export const getData = <T, ResponseRaw>({
  name,
  sql,
}: {
  name: string;
  sql: (id: T) => string;
}) => (pg: PgDriver) => (id: T) =>
  pg
    .oneOrNone<ResponseRaw>(sql(id))
    .map(fromNullable)
    .mapRejected(assoc('meta', { request: name, params: id }));
