const AppError = require('./AppError');
const { curryN } = require('ramda');

// toDbError :: AppErrorType -> Meta -> Error -> AppError.Db(Error, Meta)
const toAppError = curryN(3, (type, meta, err) => AppError[type](err, meta));

// toDbError :: Meta -> Error -> AppError.Db(Error, Meta)
const toDbError = toAppError('Db');

// toValidationError :: Meta -> Error -> AppError.Validation(Error, Meta)
const toValidationError = toAppError('Validation');

module.exports = {
  toAppError,
  toDbError,
  toValidationError,
};
