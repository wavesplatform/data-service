const transformToCache = require('../transformToCache');
const { BigNumber } = require('@waves/data-entities');
const pair = require('../../__test__/mocks/pair');

describe('Redis transformToCache', () => {
  it('should do nothing to an empty array', () => {
    expect(transformToCache([])).toEqual([]);
  });

  it('should correctly transform a valid toCache array', () => {
    const p = pair('WAVES', 'BTC');
    expect(
      transformToCache([[p, { q: new BigNumber(20000) }]])
    ).toMatchSnapshot();
  });
});
