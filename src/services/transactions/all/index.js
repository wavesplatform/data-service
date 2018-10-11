const Task = require('folktale/concurrency/task');
const {
  pipe,
  map,
  groupBy,
  prop,
  toPairs,
  pick,
  isNil,
  reject,
  ifElse,
  flatten,
  indexBy,
  identity,
  evolve,
} = require('ramda');

const commonData = require('./commonData');

const createServices = {
  1: require('../genesis'),
  2: require('../send'),
  3: require('../issue'),
  4: require('../transfer'),
  5: require('../reissue'),
  6: require('../burn'),
  7: require('../exchange'),
  8: require('../lease'),
  9: require('../leaseCancel'),
  10: require('../alias'),
  11: require('../massTransfer'),
  12: require('../data'),
  13: require('../setScript'),
  14: require('../sponsorship'),
};

const getData = prop('data');

// @todo
// request by (id, timestamp) instead of just id
// to ensure correct tx response even if
// id is duplicated (happens in send, alias txs)
module.exports = deps => {
  const commonTxData = commonData(deps);
  const txsServices = map(f => f(deps), createServices);

  /**
   * idTypeFromCommonData
   * List CommonData -> { id, type }[]
   */
  const idTypeFromCommonData = pipe(
    getData,
    map(
      pipe(
        getData,
        pick(['id', 'type'])
      )
    )
  );

  /**
   * resultsFromIdType
   * returns unordered response data from types and ids
   * { id, type }[] -> Task TxData[]
   */
  const resultsFromIdType = pipe(
    groupBy(prop('type')),
    toPairs,
    map(([type, txs]) =>
      Task.of(console.time(type))
        .chain(() => txsServices[type].mget(txs.map(prop('id'))))
        .map(x => console.timeEnd(type) || x)
    ),
    Task.waitAll,
    map(
      pipe(
        map(getData),
        flatten,
        map(getData)
      )
    )
  );

  return {
    get: id =>
      commonTxData
        .get(id) //Task tx | null
        .chain(
          ifElse(
            isNil,
            Task.of,
            pipe(
              getData,
              t => txsServices[t.type].get(t.id)
            )
          )
        ),

    mget: ids =>
      commonTxData
        .mget(ids) // Task (tx | null)[]
        .chain(txsList =>
          pipe(
            evolve({ data: reject(isNil) }),
            idTypeFromCommonData,
            resultsFromIdType, // Task TxData[]
            // format output
            map(
              pipe(
                indexBy(prop('id')),
                resultsMap => ({
                  ...txsList,
                  data: txsList.data.map(
                    ifElse(isNil, identity, t => ({
                      ...t,
                      data: resultsMap[t.data.id],
                    }))
                  ),
                })
              )
            )
          )(txsList)
        ),

    search: filters =>
      Task.of((console.time('dbQuery'), console.time('commonData'))).chain(() =>
        commonTxData
          .search(filters)
          .map(x => console.timeEnd('commonData') || x)
          .chain(txsList =>
            pipe(
              idTypeFromCommonData,
              resultsFromIdType,
              // format output
              map(
                pipe(
                  indexBy(prop('id')),
                  resultsMap => ({
                    ...txsList,
                    data: txsList.data.map(t => ({
                      ...t,
                      data: resultsMap[t.data.id],
                    })),
                  })
                )
              )
            )(txsList)
          )
          .map(x => console.timeEnd('dbQuery') || x)
      ),
  };
};
