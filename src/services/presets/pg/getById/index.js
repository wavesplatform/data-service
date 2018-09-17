const { identity } = require('ramda');
const createResolver = require('../../../../resolvers/create');

const { validateInput, validateResult } = require('../../validation');
const { input } = require('./inputSchema');
const transformResultFn = require('./transformResult');

const getData = require('./pg');

module.exports = ({ name, sql, resultSchema, transformResult }) => ({
  pg,
  emitEvent,
}) =>
  createResolver.get({
    transformInput: identity,
    transformResult: transformResultFn(transformResult),
    validateInput: validateInput(input),
    validateResult: validateResult(resultSchema),
    dbQuery: getData({ name, sql }),
  })({ db: pg, emitEvent });
