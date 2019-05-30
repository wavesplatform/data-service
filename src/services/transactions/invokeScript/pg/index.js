const Maybe = require('folktale/maybe');
const { head, propEq } = require('ramda');
const { toDbError } = require('../../../../errorHandling');

const { matchRequestsResults } = require('../../../../utils/db');

const sql = require('./sql');
const transformResult = require('./transformResult');

export default {
  get: pg => id =>
    pg
      .any(sql.get(id))
      .map(transformResult)
      .map(head)
      .map(Maybe.fromNullable)
      .mapRejected(
        toDbError({ request: 'transactions.invokeScript.get', params: id })
      ),

  mget: pg => ids =>
    pg
      .any(sql.mget(ids))
      .map(transformResult)
      .map(matchRequestsResults(propEq('id'), ids))
      .mapRejected(
        toDbError({ request: 'transactions.invokeScript.mget', params: ids })
      ),

  search: pg => filters =>
    pg
      .any(sql.search(filters))
      .map(transformResult)
      .mapRejected(
        toDbError({
          toDbError: 'transactions.invokeScript.search',
          params: filters,
        })
      ),
};
