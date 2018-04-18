const batchQuery = require('./');

// const { equals } = require('ramda');
// const universalProxy = new Proxy(
//   {},
//   { get: () => universalProxy, toString: () => '', valueOf: () => 1 }
// );
// const apiMockImplementation = require('../../mocks/api');
// const apiMock = {
//   getAssets: jest.fn(apiMockImplementation.getAssets),
// };

// const requests = [10, 20, 30];
// const results = [100, 300];
const matchFn = (req, res) => res === req * 10;

describe('Batch query results should', () => {
  it('match ordering of requests', () => {
    expect(batchQuery([10, 20, 30], [300, 200, 100], matchFn)).toEqual([
      100,
      200,
      300,
    ]);
  });
  it('insert nulls if no matching response found', () => {
    expect(batchQuery([10, 20, 30], [300, 100], matchFn)).toEqual([
      100,
      null,
      300,
    ]);
    expect(batchQuery([10, 20, 30], [], matchFn)).toEqual([null, null, null]);
  });

  it('ignore results not matching any request', () => {
    expect(batchQuery([10, 20, 30], [300, 900], matchFn)).toEqual([
      null,
      null,
      300,
    ]);
  });
});
