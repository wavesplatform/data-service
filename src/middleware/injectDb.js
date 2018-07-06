const compose = require('koa-compose');

const { createDriver, createAdapter } = require('../db');
const inject = require('./inject');

module.exports = options => {
  const driver = createDriver(options);
  return compose([
    inject(['drivers', 'pg'], driver),
    inject(['db'], createAdapter(driver)),
  ]);
};
