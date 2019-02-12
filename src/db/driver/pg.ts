import { DbError } from 'errorHandling';

// Module transforms pg-promise into pg-task
import { pgpConnect } from './pgp';
import { ITask } from 'pg-promise';
import { fromPromised } from 'folktale/concurrency/task';

import { Task } from 'folktale/concurrency/task';

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
      fromPromised<DbError, null>(() => driverP.none(query, values))(),
    one: <T>(query: SqlQuery, values?: any) =>
      fromPromised<DbError, T>(() => driverP.one(query, values))(),
    oneOrNone: <T>(query: SqlQuery, values?: any) =>
      fromPromised<DbError, T>(() => driverP.oneOrNone(query, values))(),
    many: <T>(query: SqlQuery, values?: any) =>
      fromPromised<DbError, T[]>(() => driverP.many(query, values))(),
    any: <T>(query: SqlQuery, values?: any) =>
      fromPromised<DbError, T[]>(() => driverP.any(query, values))(),
    task: <T>(cb: (t: ITask<{}>) => T | Promise<T>) =>
      fromPromised<DbError, T>(() => driverP.task(cb))(),
    tx: <T>(cb: (t: ITask<{}>) => T | Promise<T>) =>
      fromPromised<DbError, T>(() => driverP.tx(cb))(),
  };

  return driverT;
};
