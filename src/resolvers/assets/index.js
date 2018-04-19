// RORO
const { ResolverError } = require('../../utils/error');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });
const { inputSchema, outputSchema } = require('./schema');

const { Either } = require('monet');
const {
  of: taskOf,
  rejected: taskRejected,
} = require('folktale/concurrency/task');

const createError = type => message => {
  let error = new Error(message);
  error.type = type;
  return error;
};
const ValidationError = createError('Validation');
const validate = (schema, what) => error =>
  ajv.validate(inputSchema, what) ? Either.Right(what) : Either.Left(error);

const validateInput = options =>
  validate(inputSchema, options)(
    ValidationError(`Wrong arguments: ${JSON.stringify(options)}`)
  );

// const validateResult = result =>
//   validate(outputSchema, result)(
//     ValidationError(`Wrong result shape: ${JSON.stringify(result)}`)
//   );
const getResults = ({ ids, db }) => {
  const res = db.assets(ids);
  return res.run().promise();
};
const logger = label => a => {
  console.log(label, a);
  return a;
};

// assetsResolver :: { ids: string[], api } -> Task(Error, Asset[])
const assetsResolver = (options = {}) =>
  Either.Right(options)
    .chain(validateInput)
    .chain(getResults);
// .cata(taskRejected, taskOf);
// .chain(validateResult);

module.exports = assetsResolver;
