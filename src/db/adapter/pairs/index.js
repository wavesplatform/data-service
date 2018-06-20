const { map, zipWith } = require('ramda');
const Maybe = require('folktale/maybe');

const batchQueries = require('./batchQueries');
const transformResults = require('./transformResults');

const createDbAdapter = ({ taskedDbDriver: dbT, errorFactory, sql }) => {
  return {
    /** pairs.one :: Pair -> Task (Maybe Result) AppError.Db */
    one(pair) {
      return dbT
        .task(batchQueries(sql.build.pairs, pair))
        .map(transformResults(pair))
        .map(Maybe.fromNullable)
        .mapRejected(errorFactory({ request: 'pairs.one', params: pair }));
    },

    // /** pairs.many :: Pair -> Task (Maybe Result)[] AppError.Db */
    many(ps) {
      return dbT
        .task(t =>
          t.batch(ps.map(p => t.task(batchQueries(sql.build.pairs, p))))
        )
        .map(zipWith(transformResults, ps))
        .map(map(Maybe.fromNullable))
        .mapRejected(errorFactory({ request: 'pairs.many', params: ps }));
    },
  };
};

module.exports = createDbAdapter;
