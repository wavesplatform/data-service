const { map, zipWith } = require('ramda');
const Maybe = require('folktale/maybe');

const selectQuery = require('./selectQuery');
const transformResults = require('./transformResults');

const { toDbError } = require('../../../../../errorHandling');

const createPgAdapter = ({ pg, sql }) => {
  return {
    /** get :: Pair -> Task (Maybe Result) AppError.Db */
    get(pair) {
      return pg
        .oneOrNone(selectQuery(sql, pair))
        .map(transformResults(pair))
        .map(Maybe.fromNullable)
        .mapRejected(toDbError({ request: 'pairs.get', params: pair }));
    },

    // /** mget :: Pair -> Task (Maybe Result)[] AppError.Db */
    mget(ps) {
      return pg
        .task(t => t.batch(ps.map(p => t.oneOrNone(selectQuery(sql, p)))))
        .map(zipWith(transformResults, ps))
        .map(map(Maybe.fromNullable))
        .mapRejected(toDbError({ request: 'pairs.mget', params: ps }));
    },
  };
};

module.exports = createPgAdapter;
