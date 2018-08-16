const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');

const { assoc, always } = require('ramda');

const tap = require('../../../../utils/tap');

const { stateToResult, prepareForCaching } = require('./mgetUtils');
const logRedisError = require('./logRedisError');

module.exports = ({ pgAdapter, redisAdapter, emitEvent }) => {
  return {
    get: pair =>
      redisAdapter
        .get(pair)
        .mapRejected(logRedisError(emitEvent)) // log cache error
        .chain(maybeCached =>
          maybeCached.matchWith({
            Nothing: () =>
              Task.rejected(pair).mapRejected(tap(emitEvent('CACHE_MISS'))), // log cache miss,
            Just: () => Task.of(maybeCached), // Task Maybe r
          })
        )
        .map(tap(meta => emitEvent('CACHE_HIT', { level: 'info', meta }))) // log cache hit
        .orElse(() =>
          pgAdapter
            .get(pair)
            // @impure
            .map(maybeResp =>
              maybeResp.map(resp => {
                // only if db responded with actual data
                redisAdapter
                  .cache([[pair, resp]])
                  .map(tap(() => emitEvent('CACHE_CACHED', { level: 'info' })))
                  .run();
                return resp;
              })
            )
        ),
    mget: pairs =>
      Task.of({
        request: pairs,
        cacheResp: pairs.map(always(Maybe.Nothing())), // by default, act as if cache returned nothing
        dbResp: [],
      })
        .chain(
          s =>
            redisAdapter
              .mget(s.request)
              .map(resp => assoc('cacheResp', resp, s))
              .mapRejected(logRedisError(emitEvent)) // log cache error
              .orElse(always(Task.of(s))) // but continue chain as if cache returned nothing
        )
        .map(s => (emitEvent('CACHE_RETURNED', s.cacheResp), s))
        .chain(s => {
          const cacheMisses = s.request.filter(
            (_, i) => !s.cacheResp[i].getOrElse(false)
          );

          return !cacheMisses.length
            ? Task.of(s)
            : pgAdapter
              .mget(cacheMisses)
              .map(tap(emitEvent('DB_RETURNED'))) // log db response
              .map(dbResp => assoc('dbResp', dbResp, s));
        })
        // @impure
        // writes what needs to be cached to redis
        .map(s => {
          redisAdapter.cache(prepareForCaching(s)).run();
          return s;
        })
        .map(stateToResult),
  };
};
