const Maybe = require('folktale/maybe');
const { head } = require('ramda');

const { toDbError } = require('../../../../errorHandling');

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

  search: pg => filters =>
    pg
      .any(sql.search(filters))
      .map(transformResult)
      .mapRejected(
        toDbError({
          toDbError: 'transactions.data.many',
          params: filters,
        })
      ),
};
