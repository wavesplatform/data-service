const Task = require('folktale/concurrency/task');

const eitherToTask = require('../../utils/eitherToTask');
const { compose, chain, map } = require('ramda');

/** chainET :: (a -> Either b c) -> Task a d -> Task b c */
const chainET = f => compose(chain(eitherToTask), map(f));

/** createResolver :: Dependencies -> RuntimeOptions -> AssetId[] -> Task Result[] AppError */
const createResolver = ({ validateInput, validateResult }) => ({ db }) =>
  compose(
    chainET(validateResult),
    chain(db.assets),
    chainET(validateInput),
    Task.of
  );

module.exports = createResolver;
