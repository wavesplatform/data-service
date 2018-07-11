const { map, slice, merge, compose } = require('ramda');
const Maybe = require('folktale/maybe');

// @hack — workaround of postgres limit 1 issue
const { MIN_LIMIT } = require('./constants');

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
    // @hack — workaround of postgres limit 1 issue
    const withLimit1Fix = ({ limit, ...rest }) => ({
      ...rest,
      limit: Math.max(limit, MIN_LIMIT),
    });

    const filtersModified = compose(
      withLimit1Fix,
      withDefaults
    )(filters);

    return dbT
      .any(sql.build.transactions.exchange.many(filtersModified))
      .map(slice(0, withDefaults(filters).limit))
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
