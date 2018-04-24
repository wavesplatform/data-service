const maybeResults = require('../utils/maybeResults');

const { Just, Nothing } = require('folktale/maybe');

const matchFn = (req, res) => res === req * 10;

describe('Batch query results should', () => {
  it('match ordering of requests', () => {
    expect(maybeResults(matchFn, [10, 20, 30], [300, 200, 100])).toEqual([
      Just(100),
      Just(200),
      Just(300),
    ]);
  });
  it('insert nulls if no matching response found', () => {
    expect(maybeResults(matchFn, [10, 20, 30], [300, 100])).toEqual([
      Just(100),
      Nothing(),
      Just(300),
    ]);
    expect(maybeResults(matchFn, [10, 20, 30], [])).toEqual([
      Nothing(),
      Nothing(),
      Nothing(),
    ]);
  });

  it('ignore results not matching any request', () => {
    expect(maybeResults(matchFn, [10, 20, 30], [300, 900])).toEqual([
      Nothing(),
      Nothing(),
      Just(300),
    ]);
  });
});
