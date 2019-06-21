const compose = require('koa-compose');

const inject = require('./inject');

module.exports = config => {
  return compose([
    inject(['config'], config)
  ]);
};
