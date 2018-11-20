const { identity } = require('ramda');
const createResolver = require('../../../_common/create');

const { validateInput, validateResult } = require('../../validation');
const transformResultFn = require('./transformResult');

const getData = require('./pg');

module.exports = ({
  name,
  sql,
  inputSchema,
  resultSchema,
  resultTypeFactory,
  transformResult
}) => ({ pg, emitEvent }) =>
  createResolver.get({
    transformInput: identity,
    transformResult: transformResultFn(resultTypeFactory)(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData({ name, sql }),
  })({ db: pg, emitEvent });
