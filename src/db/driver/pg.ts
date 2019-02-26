// Module transforms pg-promise into pg-task
import { pgpConnect } from './pgp';
import { ITask } from 'pg-promise';
import { fromPromised } from 'folktale/concurrency/task';

import { Task } from 'folktale/concurrency/task';
import { DbError, toDbError } from '../../errorHandling';

export type PgDriverOptions = {
  postgresHost: string;
  postgresPort: number;
  postgresDatabase: string;
  postgresUser: string;
  postgresPassword: string;
  postgresPoolSize: number;
};

export type SqlQuery = string;

export type PgDriver = {
  none(query: SqlQuery, values?: any): Task<DbError, null>;
  one<T>(
    query: SqlQuery,
    values?: any,
    cb?: (value: any) => T,
    thisArg?: any
  ): Task<DbError, T>;
  oneOrNone<T>(
    query: SqlQuery,
    values?: any,
    cb?: (value: any) => T,
    thisArg?: any
  ): Task<DbError, T>;
  many<T>(query: SqlQuery, values?: any): Task<DbError, T[]>;
  any<T>(query: SqlQuery, values?: any): Task<DbError, T[]>;
  task<T>(cb: (t: ITask<{}>) => T | Promise<T>): Task<DbError, T>;
  tx<T>(cb: (t: ITask<{}>) => T | Promise<T>): Task<DbError, T>;
};

export const createPgDriver = (
  options: PgDriverOptions,
  connect = pgpConnect
): PgDriver => {
  const driverP = connect({
    host: options.postgresHost,
    port: options.postgresPort,
    database: options.postgresDatabase,
    user: options.postgresUser,
    password: options.postgresPassword,
    max: options.postgresPoolSize, // max connection pool size
  });

  const driverT: PgDriver = {
    none: (query: SqlQuery, values?: any) =>
      fromPromised<Error, null>(() =>
        driverP.none(query, values)
      )().mapRejected(toDbError({})),
    one: <T>(query: SqlQuery, values?: any) =>
      fromPromised<Error, T>(() => driverP.one(query, values))().mapRejected(
        toDbError({})
      ),
    oneOrNone: <T>(query: SqlQuery, values?: any) =>
      fromPromised<Error, T>(() =>
        driverP.oneOrNone(query, values)
      )().mapRejected(toDbError({})),
    many: <T>(query: SqlQuery, values?: any) =>
      fromPromised<Error, T[]>(() => driverP.many(query, values))().mapRejected(
        toDbError({})
      ),
    any: <T>(query: SqlQuery, values?: any) =>
      fromPromised<Error, T[]>(() => driverP.any(query, values))().mapRejected(
        toDbError({})
      ),
    task: <T>(cb: (t: ITask<{}>) => T | Promise<T>) =>
      fromPromised<Error, T>(() => driverP.task(cb))().mapRejected(
        toDbError({})
      ),
    tx: <T>(cb: (t: ITask<{}>) => T | Promise<T>) =>
      fromPromised<Error, T>(() => driverP.tx(cb))().mapRejected(toDbError({})),
  };

  return driverT;
};
