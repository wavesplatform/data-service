const Router = require('koa-router');
const { identity } = require('ramda');

const createEndpoint = require('./_common');
const { parseBool } = require('./utils/parseBool');
const { parseArrayQuery } = require('./utils/parseArrayQuery');

module.exports = aliasesService =>
  createEndpoint('/aliases', aliasesService, {
    filterParsers: {
      address: identity,
      addresses: parseArrayQuery,
      queries: parseArrayQuery,
      showBroken: parseBool,
      aliases: parseArrayQuery,
    },
    mgetFilterName: "aliases"
  })(new Router());
