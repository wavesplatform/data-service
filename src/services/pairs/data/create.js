const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/Maybe');

const {
  assoc,
  always,
  reduceRight,
  append,
  compose,
  reverse,
} = require('ramda');

const tap = require('../../../utils/tap');

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
              .map(r => assoc('cacheResp', r, s))
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
        // merge cache and db responses to result
        .map(s => {
          const dbRespCopy = s.dbResp.slice();
          return compose(
            // since filled from end to start, reverse list
            reverse,
            // filling Nothings in cacheResp with values
            // from db starting from the end
            reduceRight(
              (x, acc) =>
                append(
                  x.matchWith({
                    Nothing: () => dbRespCopy.pop(),
                    Just: () => x,
                  }),
                  acc
                ),
              []
            )
          )(s.cacheResp);
        }),
  };
};
