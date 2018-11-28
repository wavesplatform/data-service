/* eslint-disable no-console */
const { compose, curryN } = require('ramda');
const chalk = require('chalk');

const DELEMITER = '----------------------------------------';

const printDelemiter = () => console.log(DELEMITER);
const printSuccessValueWithLabel = curryN(2, (label, value) =>
  console.log(`${chalk.green(label)}: ${value}`)
);
const printErrorValueWithLabel = curryN(2, (label, value) =>
  console.log(`${chalk.red(label)}: ${value}`)
);

const printError = compose(
  console.log,
  chalk.red
);
const printWarning = compose(
  console.log,
  chalk.yellow
);
const printSuccess = compose(
  console.log,
  chalk.green
);

module.exports = {
  printDelemiter,
  printError,
  printWarning,
  printSuccess,
  printSuccessValueWithLabel,
  printErrorValueWithLabel,
};
