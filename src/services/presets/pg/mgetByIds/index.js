const { identity } = require('ramda');

const createResolver = require('../../../_common/createResolver');

const { validateInput, validateResult } = require('../../validation');
const transformResultFn = require('./transformResult');

const getData = require('./pg');

module.exports = ({
  name,
  sql,
  inputSchema,
  resultSchema,
  resultTypeFactory,
  matchRequestResult,
  transformResult,
}) => ({ pg, emitEvent }) =>
  createResolver.mget({
    transformInput: identity,
    transformResult: transformResultFn(resultTypeFactory)(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData({ name, sql, matchRequestResult }),
  })({ db: pg, emitEvent });
