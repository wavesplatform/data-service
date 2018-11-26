const Monoid = require('../Monoid');

describe('Monoid type should be', () => {
  it('constructed from object', () => {
    expect(new Monoid({concat: (a, b) => a + b, empty: 0})).toBeInstanceOf(Object);
  });
});
