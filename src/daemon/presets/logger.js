/* eslint-disable no-console */
const { curryN } = require('ramda');
const chalk = require('chalk');

const DELEMITER = '----------------------------------------';
const printDelemiter = () => console.log(DELEMITER);
const printSuccessValueWithLabel = curryN(2, (label, value) =>
  console.log(`${chalk.green(label)}: ${value}`)
);
const printErrorValueWithLabel = curryN(2, (label, value) =>
  console.log(`${chalk.red(label)}: ${value}`)
);
const printError = value => console.log(chalk.red(value));
const printWarning = value => console.log(chalk.yellow(value));
const printSuccess = value => console.log(chalk.green(value));

module.exports = {
  printDelemiter,
  printError,
  printWarning,
  printSuccess,
  printSuccessValueWithLabel,
  printErrorValueWithLabel
};
