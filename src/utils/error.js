const chalk = require('chalk');
function setStack(self) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(self, self.constructor);
  } else {
    self.stack = new Error().stack;
  }
}
function setTS(self) {
  self.ts = new Date();
  self.ts.toString = self.ts.toLocaleString;
}
function config(self) {
  setTS(self);
  setStack(self);
}

class CustomError extends Error {
  constructor(message = '', ...args) {
    super(...args);
    config(this);

    this.name = chalk.red('Custom error');
    this.message = `
    ${this.ts} | ${chalk.yellow(message)}
    `;
  }
}
class ResolverError extends Error {
  constructor(resolverName, args, ...rest) {
    super(...rest);
    config(this);

    this.name = chalk.red('Resolver error');
    this.message = `
    ${this.ts} | ${chalk.yellow(resolverName)} | ${JSON.stringify(args)}
    `;
  }
}

class RouterError extends Error {
  constructor(ctx = {}, ...args) {
    super(...args);
    config(this);

    this.name = chalk.red('Router error');
    this.message = `
    ${this.ts} | Requested: ${chalk.yellow(ctx.url)}
    `;
  }
}
module.exports = { CustomError, RouterError, ResolverError };
