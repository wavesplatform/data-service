const { BigNumber } = require('@waves/data-entities');

const pair = {
  first_price: new BigNumber(0.00075632),
  last_price: new BigNumber(0.00074128),
  volume: new BigNumber(180232.92153489),
};
const transformedPair = {
  firstPrice: new BigNumber(0.00075632),
  lastPrice: new BigNumber(0.00074128),
  volume: new BigNumber(180232.92153489),
};

module.exports = {
  pair,
  transformedPair,
};
