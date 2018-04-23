const { union } = require('folktale/adt/union');

const defaultFactory = (errorOrMessage, meta = {}) => {
  meta.timestamp = meta.timestamp || new Date();
  return errorOrMessage instanceof Error
    ? {
        error: errorOrMessage,
        meta,
      }
    : {
        error: new Error(errorOrMessage),
        meta,
      };
};

const AppError = union('AppError', {
  Resolver: defaultFactory,
  Router: defaultFactory,
  Db: defaultFactory,
});

module.exports = AppError;
