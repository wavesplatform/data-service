const Task = require('folktale/concurrency/task');
const Result = require('folktale/result');

const {
  compose,
  chain,
  map,
  always,
  identity,
  traverse,
  tap,
} = require('ramda');

const { resultToTask, liftInnerMaybe } = require('../../utils/fp');

/** chainRT :: (a -> Result b c) -> Task a d -> Task b c */
const chainRT = f => compose(chain(resultToTask), map(f));

/** createResolver :: Boolean ->
 *    Dependencies -> RuntimeOptions ->
 *    Request -> Task AppError Result */
const createResolver = oneOrMany => {
  const toValidateM = validateResult =>
    oneOrMany === 'one'
      ? liftInnerMaybe(Result.of, validateResult)
      : traverse(Result.of, liftInnerMaybe(Result.of, validateResult));

  return ({
    validateInput,
    validateResult,
    transformResult,
    dbQuery, // db -> Request -> Result
  }) => ({ db, emitEvent = always(identity) }) =>
    compose(
      map(tap(emitEvent('TRANSFORM_RESULT'))),
      map(transformResult), // Task AppError Result
      map(tap(emitEvent('RESULT_VALIDATION'))),
      chainRT(toValidateM(validateResult)), // Task AppError Maybe DbResult
      map(tap(emitEvent('DB_QUERY'))),
      chain(dbQuery(db)), // Task AppError Maybe DbResult
      map(tap(emitEvent('INPUT_VALIDATION'))),
      chainRT(validateInput), // Task AppError Request
      Task.of // Task * Request
    );
};

module.exports = {
  one: createResolver('one'),
  many: createResolver('many'),
};
