const { curry } = require('ramda');

const composeQuery = curry(({ query, queryWithWaves }, pair) => {
  if (pair.priceAsset === 'WAVES' || pair.amountAsset === 'WAVES')
    return query(pair);
  else return queryWithWaves(pair);
});

module.exports = composeQuery;
