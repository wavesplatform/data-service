const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/Maybe');

const { map } = require('ramda');

const { toDbError } = require('../../../../errorHandling');

const getKey = require('./key');
const { parse } = require('./serialization');
const transformToCache = require('./transformToCache');

module.exports = ({ redis }) => {
  return {
    // get: pair =>
    //   Task.fromPromised(() => redis.get(getKey(pair)))
    //     .map(Maybe.fromNullable)
    //     .map(tap(console.log))
    //     .mapRejected(toDbError({ request: 'redis.pairs.get', params: pair })),
    get: pair => Task.of(Maybe.Nothing()),
    mget: pairs => {
      return redis
        .mget(pairs.map(getKey))
        .map(map(Maybe.fromNullable))
        .map(map(map(parse))) // Task List Maybe
        .mapRejected(toDbError({ request: 'redis.pairs.mget', params: pairs }));
    },

    cache: toCache => {
      if (!toCache || !toCache.length) return Task.of(null);

      return redis
        .mset(transformToCache(toCache))
        .mapRejected(
          toDbError({ request: 'redis.pairs.cache', params: toCache })
        );
    },
  };
};
