const { union } = require('folktale/adt/union');

const defaultFactory = type => (errorOrMessage, meta = {}) =>
  errorOrMessage instanceof Error
    ? {
      error: errorOrMessage,
      type,
      meta,
    }
    : {
      error: new Error(errorOrMessage),
      type,
      meta,
    };

const AppError = union('AppError', {
  Resolver: defaultFactory('ResolverError'),
  Db: defaultFactory('DBError'),
  Validation: defaultFactory('ValidationError'),
});

module.exports = AppError;
