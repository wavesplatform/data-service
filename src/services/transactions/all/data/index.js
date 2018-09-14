const createPgAdapter = require('./pg');
const Task = require('folktale/concurrency/task');
const { pipe, map, groupBy, prop, toPairs } = require('ramda');
const swapMaybeF = require('../../../../utils/fp/swapMaybeF');
const servicesByType = {
  4: require('../../transfer'),
  8: require('../../lease'),
  // 9: require('../../leaseCancel'),
  11: require('../../massTransfer'),
  // 12: require('../../data'),
};

const getService = type =>
  servicesByType[type]
    ? servicesByType[type]
    : () => ({ one: () => Task.rejected(), many: () => Task.rejected() });

module.exports = ({ drivers, emitEvent }) => {
  const pgAdapter = createPgAdapter(drivers);
  return {
    get: id =>
      pgAdapter
        .get(id) //Task Maybe tx
        .chain(
          pipe(
            map(({ tx: { id, type } }) =>
              getService(type)({ drivers, emitEvent }).get(id)
            ),
            swapMaybeF(Task.of)
          )
        ),
    search: filters =>
      pgAdapter.search(filters).chain(
        pipe(
          map(({ tx: { id, type } }) => ({ id, type })),
          groupBy(prop('type')),
          toPairs,
          ([type, txs]) =>
            getService(type)({ drivers, emitEvent }).mget(txs.map(prop('id'))),
          Task.waitAll
        )
      ),
  };
};
