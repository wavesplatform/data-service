const Task = require('folktale/concurrency/task');

const { compose, chain, map, always, identity, tap } = require('ramda');

const eitherToTask = require('../utils/eitherToTask');

/** chainET :: (a -> Either b c) -> Task a d -> Task b c */
const chainET = f => compose(chain(eitherToTask), map(f));

/** createResolver :: Dependencies -> RuntimeOptions -> AssetId[] -> Task Result[] AppError */
const createResolver = ({
  validateInput,
  validateResult,
  transformResult,
  dbQuery,
}) => ({ db, emitEvent = always(identity) }) =>
  compose(
    map(tap(emitEvent('RESOLVER_OK'))),
    map(transformResult),
    map(tap(emitEvent('OUTPUT_VALIDATION_OK'))),
    chainET(validateResult),
    map(tap(emitEvent('DB_QUERY_OK'))),
    chain(dbQuery(db)),
    map(tap(emitEvent('INPUT_VALIDATION_OK'))),
    chainET(validateInput),
    Task.of
  );

module.exports = createResolver;
