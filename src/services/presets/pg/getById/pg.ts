import { fromNullable } from 'folktale/maybe';
import { PgDriver } from '../../../../db/driver';
import { pgErrorMatching } from '../../../_common/utils';

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
    .mapRejected(pgErrorMatching({ request: name, params: { id } }));
