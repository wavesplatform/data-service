const { BigNumber } = require('@waves/data-entities');

const { curry } = require('ramda');

const convertPrice = curry((aDecimals, pDecimals, price) =>
  price.multipliedBy(new BigNumber(10).pow(-8 + aDecimals - pDecimals))
);

const convertAmount = curry((decimals, amount) =>
  amount.multipliedBy(new BigNumber(10).pow(-decimals))
);

module.exports = {
  convertPrice,
  convertAmount,
};
