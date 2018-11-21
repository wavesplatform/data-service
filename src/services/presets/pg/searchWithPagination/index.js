const createResolver = require('../../../_common/createResolver');

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
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData({ name, sql }),
  })({ db: pg, emitEvent });
