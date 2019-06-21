import { fromNullable, Maybe } from 'folktale/maybe';
import { head, propEq } from 'ramda';

import { PgDriver } from '../../../../db/driver';
import { matchRequestsResults } from '../../../../utils/db';
import { DbError, toDbError } from '../../../../errorHandling';

import sql from './sql';
import { transformResult } from './transformResult';
import { DbRawInvokeScriptTx, RawInvokeScriptTx } from '../types';

export default {
  get: (pg: PgDriver) => (id: string) =>
    pg
      .any<DbRawInvokeScriptTx>(sql.get(id))
      .map<RawInvokeScriptTx[]>(transformResult)
      .map<RawInvokeScriptTx>(head)
      .map<Maybe<RawInvokeScriptTx>>(fromNullable)
      .mapRejected<DbError>(e =>
        toDbError(
          { request: 'transactions.invokeScript.get', params: id },
          e.error
        )
      ),

  mget: (pg: PgDriver) => (ids: string[]) =>
    pg
      .any<DbRawInvokeScriptTx>(sql.mget(ids))
      .map<RawInvokeScriptTx[]>(transformResult)
      .map<Maybe<RawInvokeScriptTx>[]>(matchRequestsResults(propEq('id'), ids))
      .mapRejected<DbError>(e =>
        toDbError(
          { request: 'transactions.invokeScript.mget', params: ids },
          e.error
        )
      ),

  search: (pg: PgDriver) => (filters: Record<string, any>) =>
    pg
      .any<DbRawInvokeScriptTx>(sql.search(filters))
      .map<RawInvokeScriptTx[]>(transformResult)
      .mapRejected<DbError>(e =>
        toDbError(
          {
            request: 'transactions.invokeScript.search',
            params: filters,
            message: e.error.message,
          },
          e.error
        )
      ),
};
