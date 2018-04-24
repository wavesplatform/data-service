const { union } = require('folktale/adt/union');

const defaultFactory = (errorOrMessage, meta = {}) =>
  errorOrMessage instanceof Error
    ? {
      error: errorOrMessage,
      meta,
    }
    : {
      error: new Error(errorOrMessage),
      meta,
    };

const AppError = union('AppError', {
  Resolver: defaultFactory,
  Router: defaultFactory,
  Db: defaultFactory,
  Validation: defaultFactory,
});

module.exports = AppError;
