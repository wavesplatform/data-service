const { identity } = require('ramda');
const createResolver = require('../../../../resolvers/create');

const { validateInput, validateResult } = require('../../validation');
const { input } = require('./inputSchema');
const transformResultFn = require('./transformResult');

const getData = require('./pg');

module.exports = ({
  name,
  sql,
  resultSchema,
  resultTypeFactory,
  matchRequestResult,
  transformResult,
}) => ({ pg, emitEvent }) =>
  createResolver.mget({
    transformInput: identity,
    transformResult: transformResultFn(resultTypeFactory)(transformResult),
    validateInput: validateInput(input, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData({ name, sql, matchRequestResult }),
  })({ db: pg, emitEvent });
