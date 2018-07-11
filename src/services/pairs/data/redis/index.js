const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');

const { map } = require('ramda');

const { toDbError } = require('../../../../errorHandling');

const getKey = require('./key');
const { parse, stringify } = require('./serialization');

const CACHE_EXPIRATION_SECONDS = 10;

module.exports = ({ redis }) => {
  return {
    get: pair =>
      redis
        .get(getKey(pair))
        .map(Maybe.fromNullable) // Task Maybe
        .map(map(parse))
        .mapRejected(toDbError({ request: 'redis.pairs.get', params: pair })),

    mget: pairs =>
      redis
        .mget(pairs.map(getKey))
        .map(map(Maybe.fromNullable))
        .map(map(map(parse))) // Task List Maybe
        .mapRejected(toDbError({ request: 'redis.pairs.mget', params: pairs })),

    cache: toCache => {
      if (!toCache || !toCache.length) return Task.of(null);

      const transaction = toCache.reduce(
        (tx, objToCache) =>
          tx.set([
            getKey(objToCache[0]),
            stringify(objToCache[1]),
            'EX',
            CACHE_EXPIRATION_SECONDS,
          ]),
        redis.multi()
      );

      return transaction
        .exec()
        .mapRejected(
          toDbError({ request: 'redis.pairs.cache', params: toCache })
        );
    },
  };
};
