const Task = require('folktale/concurrency/task');
const {
  pipe,
  map,
  groupBy,
  prop,
  toPairs,
  pick,
  isNil,
  ifElse,
  flatten,
  indexBy,
} = require('ramda');

const { Transaction } = require('../../../types');

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

    search: filters =>
      commonTxData.search(filters).chain(txsList =>
        pipe(
          getData,
          map(
            pipe(
              getData,
              pick(['id', 'type'])
            )
          ),
          txs => {
            const requestsT = pipe(
              groupBy(prop('type')),
              toPairs,
              map(([type, txs]) => txsServices[type].mget(txs.map(prop('id')))),
              Task.waitAll
            )(txs);

            return requestsT.map(
              pipe(
                map(getData),
                flatten,
                map(getData),
                indexBy(prop('id')),
                resultsMap => txs.map(prop('id')).map(id => resultsMap[id]),
                // to preserve cursor from commonData service
                txs => ({ ...txsList, data: txs.map(Transaction) })
              )
            );
          }
        )(txsList)
      ),
  };
};
