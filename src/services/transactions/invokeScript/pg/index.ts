import { fromNullable, Maybe } from 'folktale/maybe';
import { head, propEq } from 'ramda';

import { PgDriver } from '../../../../db/driver';
import { matchRequestsResults } from '../../../../utils/db';
import { toDbError } from '../../../../errorHandling';
import { withStatementTimeout } from '../../../_common/utils';

import sql from './sql';
import { transformResult } from './transformResult';
import {
  RawInvokeScriptTx as DbRawInvokeScriptTx,
  RawInvokeScriptTx,
} from '../types';

export default {
  get: (pg: PgDriver) => (statementTimeout: number) => (id: string) =>
    pg
      .any<DbRawInvokeScriptTx>(
        withStatementTimeout(statementTimeout, sql.get(id))
      )
      .map(transformResult)
      .map<RawInvokeScriptTx>(head)
      .map(fromNullable)
      .mapRejected(e =>
        toDbError(
          { request: 'transactions.invokeScript.get', params: id },
          e.error
        )
      ),

  mget: (pg: PgDriver) => (statementTimeout: number) => (ids: string[]) =>
    pg
      .any<DbRawInvokeScriptTx>(
        withStatementTimeout(statementTimeout, sql.mget(ids))
      )
      .map(transformResult)
      .map<Maybe<RawInvokeScriptTx>[]>(matchRequestsResults(propEq('id'), ids))
      .mapRejected(e =>
        toDbError(
          { request: 'transactions.invokeScript.mget', params: ids },
          e.error
        )
      ),

  search: (pg: PgDriver) => (statementTimeout: number) => (
    filters: Record<string, any>
  ) =>
    pg
      .any<DbRawInvokeScriptTx>(
        withStatementTimeout(statementTimeout, sql.search(filters))
      )
      .map(transformResult)
      .mapRejected(e =>
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
