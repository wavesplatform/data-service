const { map, head } = require('ramda');
const Maybe = require('folktale/maybe');

const transformResult = require('./transformResult');

// db adapter factory
const createAdapter = ({ taskedDbDriver: dbT, errorFactory, sql }) => ({
  one(x) {
    return dbT
      .any(sql.build.transactions.data.one(x))
      .map(transformResult)
      .map(head)
      .map(Maybe.fromNullable)
      .mapRejected(
        errorFactory({ request: 'transactions.data.one', params: x })
      );
  },

  many(filters) {
    return dbT
      .any(sql.build.transactions.data.many(filters))
      .map(transformResult)
      .map(map(Maybe.fromNullable))
      .mapRejected(
        errorFactory({
          request: 'transactions.data.many',
          params: filters,
        })
      );
  },
});

module.exports = createAdapter;
