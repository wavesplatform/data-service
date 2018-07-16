const { map, merge } = require('ramda');
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

  many(filters = {}) {
    const withDefaults = merge({ limit: 100 });

    const filtersModified = withDefaults(filters);

    return dbT
      .any(sql.build.transactions.exchange.many(filtersModified))
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
