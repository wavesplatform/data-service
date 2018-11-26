const {
  curryN,
} = require('ramda');
const chalk = require('chalk');

const DELEMITER = '----------------------------------------';
const printDelemiter = () => console.log(DELEMITER);
const printValueWithLabel = curryN(2, (label, value) =>
  console.log(`${chalk.green(label)}: ${value}`)
);
const printError = value => console.log(chalk.red(value));
const printSuccess = value => console.log(chalk.green(value));

module.exports = {
  printDelemiter,
  printError,
  printSuccess,
  printValueWithLabel
}