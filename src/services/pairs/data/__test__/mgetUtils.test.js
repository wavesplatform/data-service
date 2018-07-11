const Maybe = require('folktale/maybe');
const { stateToResult, prepareForCaching } = require('../create/mgetUtils');

const pair = require('./mocks/pair');

// request state in different cases
const request = [pair('ETH', 'BTC'), pair('WAVES', 'BTC'), pair('BTC', 'USD')];
const getPairResp = index => Maybe.of({ pair: request[index] });
const fullResp = [getPairResp(0), getPairResp(1), getPairResp(2)];
const fullCache = {
  request,
  cacheResp: fullResp,
  dbResp: [],
};
const zeroCacheFullDb = {
  request,
  cacheResp: [Maybe.Nothing(), Maybe.Nothing(), Maybe.Nothing()],
  dbResp: fullResp,
};
const partCachePartDb = {
  request,
  cacheResp: [Maybe.Nothing(), getPairResp(1), Maybe.Nothing()],
  dbResp: [Maybe.Nothing(), getPairResp(2)],
};

describe('stateToResult', () => {
  it('returns everything in case of full cache response', () => {
    expect(stateToResult(fullCache)).toEqual(fullResp);
  });

  it('returns everything in case of zero cache/full db response', () => {
    expect(stateToResult(zeroCacheFullDb)).toEqual(fullResp);
  });

  it('returns partial output merged from partial cache/partial db response', () => {
    expect(stateToResult(partCachePartDb)).toEqual([
      Maybe.Nothing(),
      getPairResp(1),
      getPairResp(2),
    ]);
  });
});

describe('prepareForCaching', () => {
  it('caches nothing in case of full cache response', () => {
    expect(prepareForCaching(fullCache)).toEqual([]);
  });

  it('caches everything in case of zero cache/full db response', () => {
    expect(prepareForCaching(zeroCacheFullDb)).toEqual(
      request.map((r, i) => [r, getPairResp(i).getOrElse()])
    );
  });

  it('caches right values in case of partial cache/partial db response', () => {
    expect(prepareForCaching(partCachePartDb)).toEqual([
      [request[2], getPairResp(2).getOrElse()],
    ]);
  });
});
