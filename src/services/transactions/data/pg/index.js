const Maybe = require('folktale/maybe');
const { head, propEq } = require('ramda');

const { toDbError } = require('../../../../errorHandling');

const { matchRequestsResults } = require('../../../../utils/db/index');

const { withStatementTimeout } = require('../../../_common/utils');

const transformResult = require('./transformResult');
const sql = require('./sql');

const pg = {
  get: pg => statementTimeout => id =>
    pg
      .any(withStatementTimeout(statementTimeout, sql.get(id)))
      .map(transformResult)
      .map(head)
      .map(Maybe.fromNullable)
      .mapRejected(e =>
        toDbError({ request: 'transactions.data.get', params: id }, e.error)
      ),

  mget: pg => statementTimeout => ids =>
    pg
      .any(withStatementTimeout(statementTimeout, sql.mget(ids)))
      .map(transformResult)
      .map(matchRequestsResults(propEq('id'), ids))
      .mapRejected(e =>
        toDbError({ request: 'transactions.data.mget', params: ids }, e.error)
      ),

  search: pg => statementTimeout => filters =>
    pg
      .any(withStatementTimeout(statementTimeout, sql.search(filters)))
      .map(transformResult)
      .mapRejected(e =>
        toDbError(
          {
            request: 'transactions.data.search',
            params: filters,
          },
          e.error
        )
      ),
};

module.exports = { pg };
