const compose = require('koa-compose');

const { createPgDriver } = require('../db');
const inject = require('./inject');

module.exports = options => {
  const pgDriver = createPgDriver(options);

  return compose([
    inject(['drivers', 'pg'], pgDriver)
  ]);
};
