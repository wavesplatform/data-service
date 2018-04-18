// const chalk = require('chalk');
function setStack(self) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(self, self.constructor);
  } else {
    self.stack = new Error().stack;
  }
}

function config(self) {
  setStack(self);
}

class CustomError extends Error {
  constructor(message = '', ...args) {
    super(...args);
    config(this);

    this.name = 'Custom error';
    this.message = message;
  }
}
class ResolverError extends Error {
  constructor(resolverName, args, ...rest) {
    super(...rest);
    config(this);

    this.name = 'Resolver error';
    this.message = `${resolverName} | ${JSON.stringify(args)}`;
  }
}

class RouterError extends Error {
  constructor(ctx = {}, ...args) {
    super(...args);
    config(this);

    this.name = 'Router error';
    this.message = `Requested: ${ctx.url}`;
  }
}
module.exports = { CustomError, RouterError, ResolverError };
