const Task = require('folktale/concurrency/task');

const eitherToTask = require('../../utils/eitherToTask');
const { compose, chain, map } = require('ramda');

// query :: Options -> Task Asset[] AppError.Db
const query = ({ api, ids }) => api.assets(ids);

// chainET :: (a -> Either b c) -> Task a d -> Task b c
const chainET = f => compose(chain(eitherToTask), map(f));

// createAssetsResolver :: Dependencies -> Options -> Task Result AppError
const createAssetsResolver = ({ validateInput, validateResult }) =>
  compose(
    chainET(validateResult),
    chain(query),
    chainET(validateInput),
    Task.of
  );

module.exports = createAssetsResolver;
