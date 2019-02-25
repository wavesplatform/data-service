describe('Monoid type should be', () => {
  it('constructed from object', () => {
    expect({
      concat: (a: number, b: number) => a + b,
      empty: 0,
    }).toBeInstanceOf(Object);
  });
});
