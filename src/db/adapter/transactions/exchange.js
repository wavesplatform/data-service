const {
  map,
  slice,
  merge,
  compose,
  propSatisfies,
  assoc,
  identity,
  ifElse,
  gt
} = require('ramda');
const Maybe = require('folktale/maybe');

// @hack — workaround of postgres limit 1 issue
const MIN_LIMIT = 5;

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
    const withLimit1Fix = ifElse(
      propSatisfies(gt(MIN_LIMIT), 'limit'),
      assoc('limit', MIN_LIMIT),
      identity
    );
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
