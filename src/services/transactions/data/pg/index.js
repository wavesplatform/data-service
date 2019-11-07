const Maybe = require('folktale/maybe');
const { head, propEq } = require('ramda');

const { addMeta } = require('../../../../errorHandling');
const { matchRequestsResults } = require('../../../../utils/db/index');

const transformResult = require('./transformResult');
const sql = require('./sql');

const pg = {
  get: pg => id =>
    pg
      .any(sql.get(id))
      .map(transformResult)
      .map(head)
      .map(Maybe.fromNullable)
      .mapRejected(addMeta({ request: 'transactions.data.get', params: id })),

  mget: pg => ids =>
    pg
      .any(sql.mget(ids))
      .map(transformResult)
      .map(matchRequestsResults(propEq('id'), ids))
      .mapRejected(addMeta({ request: 'transactions.data.mget', params: ids })),

  search: pg => filters =>
    pg
      .any(sql.search(filters))
      .map(transformResult)
      .mapRejected(
        addMeta({
          request: 'transactions.data.search',
          params: filters,
        })
      ),
};

module.exports = { pg };
