const P = require('./');

describe('Selector', () => {
  it('lastCall should return result if really called', () => {
    const spy = jest.fn();
    const p = P.create(spy);

    p.m1().q.w.m2(1, 2, 3);
    expect(P.select(spy).lastCall).toEqual({ m2: [1, 2, 3] });
  });

  it('lastCall should throw if not called', () => {
    const spy = jest.fn();
    const s = P.select(spy);
    const p = P.create(spy);

    // nothing yet here
    expect(() => s.lastCall).toThrow();

    // no call here, only fields
    p.q.w;
    expect(() => s.lastCall).toThrow();

    // no call here either, field was last
    p.a().q;
    expect(() => s.lastCall).toThrow();

    // finally, correct call
    p.b();
    expect(s.lastCall).toEqual({ b: [] });
  });

  it('lastField should correctly return last resolved field name', () => {
    const spy = jest.fn();
    const s = P.select(spy);
    const p = P.create(spy);

    p.q;
    expect(s.lastField).toBe('q');

    p.w.e;
    expect(s.lastField).toBe('e');
  });

  it('lastField should throw if field resolve was not a last action', () => {
    const spy = jest.fn();
    const s = P.select(spy);
    const p = P.create(spy);

    // nothing yet here
    expect(() => s.lastField).toThrow();

    // last was method call
    p.q.w();
    expect(() => s.lastField).toThrow();
  });

  it('callIndex should return first matching calln', () => {
    const spy = jest.fn();
    const { callIndex } = P.select(spy);
    const p = P.create(spy);

    p.q.w.e.a(1, 2).b.c(3, 4)(5, 6);

    // calls have been made
    expect(callIndex([1, 2])).toBe(4);
    expect(callIndex([3, 4])).toBe(7);
    expect(callIndex([5, 6])).toBe(8);

    // no such call
    expect(callIndex([1, 2, 3, 4])).toBe(-1);
  });
});
