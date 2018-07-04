const { map } = require('ramda');
const Maybe = require('folktale/maybe');

const transformResults = require('./transformResults');

const createDbAdapter = ({ taskedDbDriver: dbT, errorFactory, sql }) => {
  return {
    /** aliases.one :: Alias -> Task (Maybe Result) AppError.Db */
    one(alias) {
      return dbT
        .oneOrNone(sql.build.aliases.one(alias))
        .map(Maybe.fromNullable)
        .map(map(transformResults))
        .mapRejected(errorFactory({ request: 'aliases.one', params: alias }));
    },

    // /** aliases.many :: Filters -> Task (Maybe Result)[] AppError.Db */
    many(filters) {
      return dbT
        .any(sql.build.aliases.many(filters))
        .map(map(transformResults))
        .map(map(Maybe.fromNullable))
        .mapRejected(
          errorFactory({ request: 'aliases.many', params: filters })
        );
    },
  };
};

module.exports = createDbAdapter;
