const { cond, path, T } = require('ramda');

const { AppError } = require('.');

const getErrorMessage = cond([
  [e => e instanceof AppError, path(['error', 'message'])],
  [e => e instanceof Error, path(['message'])],
  [T, e => String(e)],
]);

module.exports = getErrorMessage;
