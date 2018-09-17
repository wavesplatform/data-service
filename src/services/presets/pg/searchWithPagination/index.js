const createResolver = require('../../../../resolvers/create');

const { validateInput, validateResult } = require('../../validation');
const transformInput = require('./transformInput');
const transformResultFn = require('./transformResult');

const getData = require('./pg');

module.exports = ({
  name,
  sql,
  inputSchema,
  resultSchema,
  transformResult,
}) => ({ pg, emitEvent }) =>
  createResolver.search({
    transformInput,
    transformResult: transformResultFn(transformResult),
    validateInput: validateInput(inputSchema),
    validateResult: validateResult(resultSchema),
    dbQuery: getData({ name, sql }),
  })({ db: pg, emitEvent });
