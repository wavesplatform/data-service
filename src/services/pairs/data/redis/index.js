const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/Maybe');

const { tap, map } = require('ramda');

const { toDbError } = require('../../../../errorHandling');

const getKey = require('./key');

// module.exports = ({ redis }) => {
//   return {
//     get: pair =>
//       Task.fromPromised(() => redis.get(getKey(pair)))
//         .map(Maybe.fromNullable)
//         .map(tap(console.log))
//         .mapRejected(toDbError({ request: 'redis.pairs.get', params: pair })),
//     mget: pairs =>
//       Task.fromPromised(() => redis.mget(xs.map(getKey)))
//         .map(map(Maybe.fromNullable))
//         .map(tap(console.log))
//         .mapRejected(toDbError({ request: 'redis.pairs.mget', params: pairs })),
//   };
// };

module.exports = ({ redis }) => {
  return {
    get: pair => Task.of(Maybe.Nothing()),
    // get: pair =>
    //   Task.fromPromised(() => redis.get(getKey(pair)))
    //     .map(Maybe.fromNullable)
    //     .map(tap(console.log))
    //     .mapRejected(toDbError({ request: 'redis.pairs.get', params: pair })),
    mget: pairs => Task.of(pairs.map(() => Maybe.Nothing())),
  };
};
