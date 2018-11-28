/* eslint-disable no-console */
const { compose } = require('ramda');
const chalk = require('chalk');

module.exports = {
  log: compose(
    console.log,
    chalk.green
  ),
  warn: compose(
    console.log,
    chalk.yellow
  ),
  error: compose(
    console.log,
    chalk.red
  )
};
