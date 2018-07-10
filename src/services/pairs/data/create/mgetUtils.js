const { reduceRight, append, compose, reverse } = require('ramda');

// merge cache and db responses to result

/**
 * @typedef {object} CacheableResponseState
 * @property {any} request
 * @property {object | object[]} cacheResp
 * @property {object | object[]} dbResp
 */

/**
 * merge cache and db responses to result
 * @param {CacheableResponseState} s
 * @return {any} data
 */
const stateToResult = s => {
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
};

/**
 * get objects to cache from request state
 * @param {CacheableResponseState} s
 * @return {[Pair, object][]} toCache
 */
const prepareForCaching = s => {
  let toCache = [];
  
  const isNothing = mx =>
    mx.matchWith({
      Just: () => false,
      Nothing: () => true,
    });

  let curDbIteratorPos = 0;

  // if db did not return anything, there is nothing to cache
  if (!s.dbResp.length) return toCache;

  s.cacheResp.forEach((x, i) => {
    if (isNothing(x)) {
      // if cache returned nothing, db returned something
      if (!isNothing(s.dbResp[curDbIteratorPos])) {
        // if db did return something, cache it
        toCache.push([
          s.request[i],
          s.dbResp[curDbIteratorPos].getOrElse(null),
        ]); // push request and response to cache
      }
      curDbIteratorPos++; // update iterator pos
    }
  });

  return toCache;
};

module.exports = { stateToResult, prepareForCaching };
