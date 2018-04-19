const { batchQuery } = require('../utils');

const matchFn = (req, res) => res === req * 10;

describe('Batch query results should', () => {
  it('match ordering of requests', () => {
    expect(batchQuery(matchFn, [10, 20, 30], [300, 200, 100])).toEqual([
      100,
      200,
      300,
    ]);
  });
  it('insert nulls if no matching response found', () => {
    expect(batchQuery(matchFn, [10, 20, 30], [300, 100])).toEqual([
      100,
      null,
      300,
    ]);
    expect(batchQuery(matchFn, [10, 20, 30], [])).toEqual([null, null, null]);
  });

  it('ignore results not matching any request', () => {
    expect(batchQuery(matchFn, [10, 20, 30], [300, 900])).toEqual([
      null,
      null,
      300,
    ]);
  });
});
