import { fromNullable } from 'folktale/maybe';
import { PgDriver } from 'db/driver';
import { toDbError } from '../../../../errorHandling';

export type GetByIdRequest<T> = {
  name: string;
  sql: (id: T) => string;
};

export const getData = <T, ResponseRaw>({ name, sql }: GetByIdRequest<T>) => (
  pg: PgDriver
) => (id: T) =>
  pg
    .oneOrNone<ResponseRaw>(sql(id))
    .map(fromNullable)
    .mapRejected(toDbError({ request: name, params: id }));
