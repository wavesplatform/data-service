const Task = require('folktale/concurrency/task');

const eitherToTask = require('../../utils/eitherToTask');
const { compose, chain, map } = require('ramda');

const { mapTapLog } = require('../../utils/log');

/** chainET :: (a -> Either b c) -> Task a d -> Task b c */
const chainET = f => compose(chain(eitherToTask), map(f));

/** createResolver :: Dependencies -> RuntimeOptions -> AssetId[] -> Task Result[] AppError */
const createResolver = ({ validateInput, validateResult }) => ({
  db,
  log: logFn,
}) =>
  compose(
    mapTapLog(logFn, () => `Asset resolver: Output validation ok`),
    chainET(validateResult),
    mapTapLog(
      logFn,
      assets => `Asset resolver: Got answer from db: ${JSON.stringify(assets)}`
    ),
    chain(db.assets),
    mapTapLog(logFn, () => 'Asset resolver: input validation ok'),
    chainET(validateInput),
    Task.of
  );

module.exports = createResolver;
