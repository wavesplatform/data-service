const { map } = require('ramda');
const Maybe = require('folktale/maybe');

// db adapter factory
const createAdapter = ({ taskedDbDriver: dbT, errorFactory, sql }) => ({
  one(x) {
    return dbT
      .oneOrNone(sql.build.transactions.exchange.one(x))
      .map(Maybe.fromNullable)
      .mapRejected(
        errorFactory({ request: 'transactions.exchange.one', params: x })
      );
  },

  many(filters) {
    return dbT
      .any(sql.build.transactions.exchange.many(filters))
      .map(map(Maybe.fromNullable))
      .mapRejected(
        errorFactory({
          request: 'transactions.exchange.many',
          params: filters,
        })
      );
  },
});

module.exports = createAdapter;
