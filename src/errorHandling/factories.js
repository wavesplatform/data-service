const AppError = require('./AppError');
const { curryN } = require('ramda');

// toDbError :: AppErrorType -> Meta -> Error -> AppError[AppErrorType](Error, Meta)
const toAppError = curryN(3, (type, meta, err) => AppError[type](err, meta));

// toDbError :: Meta -> Error -> AppError.Db(Error, Meta)
const toDbError = toAppError('Db');

module.exports = {
  toAppError,
  toDbError,
};
