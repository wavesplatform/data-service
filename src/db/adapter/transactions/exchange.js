const { map, slice } = require('ramda');
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

  many({ limit, ...rest } = { limit: 100 }) {
    // @hack — workaround of postgres limit 1 issue
    return dbT
      .any(
        sql.build.transactions.exchange.many({
          limit: Math.max(limit, MIN_LIMIT),
          ...rest,
        })
      )
      .map(slice(0, limit))
      .map(map(Maybe.fromNullable))
      .mapRejected(
        errorFactory({
          request: 'transactions.exchange.many',
          params: { limit, ...rest },
        })
      );
  },
});

module.exports = createAdapter;
