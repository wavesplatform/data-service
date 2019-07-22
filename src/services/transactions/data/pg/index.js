const Maybe = require('folktale/maybe');
const { head, propEq } = require('ramda');

const { toDbError } = require('../../../../errorHandling');

const { matchRequestsResults } = require('../../../../utils/db/index');

const transformResult = require('./transformResult');
const sql = require('./sql');

module.exports = {
  get: pg => id =>
    pg
      .any(sql.get(id))
      .map(transformResult)
      .map(head)
      .map(Maybe.fromNullable)
      .mapRejected(toDbError({ request: 'transactions.data.one', params: id })),

  mget: pg => ids =>
    pg
      .any(sql.mget(ids))
      .map(transformResult)
      .map(matchRequestsResults(propEq('id'), ids))
      .mapRejected(
        toDbError({ request: 'transactions.data.one', params: ids })
      ),

  search: pg => filters =>
    pg
      .any(sql.search(filters))
      .map(transformResult)
      .mapRejected(
        toDbError({
          request: 'transactions.data.many',
          params: filters,
        })
      ),
};
