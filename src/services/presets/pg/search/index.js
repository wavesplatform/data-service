const { identity } = require('ramda');

const createResolver = require('../../../_common/createResolver');

const { validateInput, validateResult } = require('../../validation');

const getData = require('./pg');

module.exports = ({
  name,
  sql,
  inputSchema,
  resultSchema,
  transformResult,
}) => ({ pg, emitEvent }) =>
  createResolver.search({
    transformInput: identity,
    transformResult: transformResult,
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData({ name, sql }),
  })({ db: pg, emitEvent });
