const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');
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
  2: require('../payment'),
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
  15: require('../setAssetScript'),
};

const getData = prop('data');

// @todo
// request by (id, timestamp) instead of just id
// to ensure correct tx response even if
// id is duplicated (happens in payment, alias txs)
module.exports = deps => {
  const commonTxData = commonData(deps);
  const txsServices = map(f => f(deps), createServices);

  const isEmpty = t => isNil(t.data);

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
    map(([type, txs]) => txsServices[type].mget(txs.map(prop('id')))),
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
        .get(id) //Task tx
        .chain(
          pipe(
            map(getData),
            m =>
              m.matchWith({
                Just: ({ value }) => txsServices[value.type].get(value.id),
                Nothing: () => Task.of(Maybe.Nothing()),
              })
          )
        ),
    mget: ids =>
      commonTxData
        .mget(ids) // Task tx[]. tx can have data: null
        .chain(txsList =>
          pipe(
            evolve({ data: reject(isEmpty) }),
            idTypeFromCommonData,
            resultsFromIdType, // Task TxData[]
            // format output,
            map(
              pipe(
                indexBy(prop('id')),
                resultsMap => ({
                  ...txsList,
                  data: txsList.data.map(
                    ifElse(isEmpty, identity, t => ({
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
      commonTxData.search(filters).chain(txsList =>
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
      ),
  };
};
