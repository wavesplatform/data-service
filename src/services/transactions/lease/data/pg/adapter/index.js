const { map } = require('ramda');
const Maybe = require('folktale/maybe');

const { toDbError } = require('../../../../../../errorHandling');

const createPgAdapter = ({ pg, sql }) => {
  return {
    /** get :: id -> Task (Maybe Result) AppError.Db */
    get(id) {
      return pg
        .oneOrNone(sql.one(id))
        .map(Maybe.fromNullable)
        .mapRejected(
          toDbError({ request: 'transactions.lease.get', params: id })
        );
    },

    // /** search :: filters -> Task (Maybe Result)[] AppError.Db */
    search(filters) {
      return pg
        .any(sql.many(filters))
        .map(map(Maybe.fromNullable))
        .mapRejected(
          toDbError({ request: 'transactions.lease.mget', params: filters })
        );
    },
  };
};

module.exports = createPgAdapter;
