const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/Maybe');

const { assoc, always } = require('ramda');

const tap = require('../../../../utils/tap');

const { stateToResult, prepareForCaching } = require('./mgetUtils');

module.exports = ({ pgAdapter, redisAdapter, emitEvent }) => {
  return {
    get: pgAdapter.get,
    // get: pair => {
    //   redisAdapter
    //     .get(pair)
    //     .chain(maybeCached =>
    //       maybeCached.matchWith({
    //         Nothing: () =>
    //           Task.rejected({ message: 'No such pair in cache', params: pair }),
    //         Just: () => Task.of(maybeCached), // Task Maybe r
    //       })
    //     )
    //     .map(tap(emitEvent('CACHE_HIT'))) // log cache hit
    //     .mapRejected(tap(emitEvent('CACHE_MISS'))) // log cache miss
    //     .mapRejected(() => pgAdapter.get(pair)); // log cache miss
    //   // emitEvent
    //   // .mapRejected(err => )

    //   pgAdapter.get(pair);
    // },
    mget: pairs => {
      return (
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
                .mapRejected(tap(emitEvent('CACHE_ERROR'))) // log cache failure
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
          .map(stateToResult)
      );
    },
  };
};
