const { map } = require('ramda');
const Maybe = require('folktale/maybe');

const { toDbError } = require('../../../../../../errorHandling');

const createPgAdapter = ({ pg, sql }) => {
  return {
    /** get :: id -> Task (Maybe Result) AppError.Db */
    get(tx4Id) {
      return pg
        .oneOrNone(sql.one(tx4Id))
        .map(Maybe.fromNullable)
        .mapRejected(
          toDbError({ request: 'transactions.transfer.get', params: tx4Id })
        );
    },

    // /** mget :: filters -> Task (Maybe Result)[] AppError.Db */
    search(filters) {
      return pg
        .any(sql.many(filters))
        .map(map(Maybe.fromNullable))
        .mapRejected(toDbError({ request: 'pairs.mget', params: filters }));
    },
  };
};

module.exports = createPgAdapter;
