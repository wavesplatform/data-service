const { compose } = require('ramda');

const P = require('./');

describe('Test proxy should', () => {
  it('object type is `function`', () => {
    const p = P.create();
    expect(typeof p).toBe('function');
  });

  it('call provided function for fields', () => {
    const spy = jest.fn();
    const p = P.create(spy);

    p.f1.f2.f3;

    expect(spy.mock.calls).toEqual([
      [{ get: 'f1' }],
      [{ get: 'f2' }],
      [{ get: 'f3' }],
    ]);
  });

  it('any field value type is `function`', () => {
    const p = P.create();
    expect(typeof p.qwe.rty).toBe('function');
  });

  it('call provided function for methods', () => {
    const spy = jest.fn();
    const p = P.create(spy);

    p.f1('f1_1', 'f1_2').f2('f2_1', 'f2_2');

    expect(spy.mock.calls).toEqual([
      [{ get: 'f1' }],
      [{ apply: ['f1_1', 'f1_2'] }],
      [{ get: 'f2' }],
      [{ apply: ['f2_1', 'f2_2'] }],
    ]);
  });

  it('call provided function for fields', () => {
    const spy = jest.fn();
    const p = P.create(spy);

    p.f1.f2.f3;

    expect(spy.mock.calls).toEqual([
      [{ get: 'f1' }],
      [{ get: 'f2' }],
      [{ get: 'f3' }],
    ]);
  });

  it('gets constructed from object`', () => {
    const spy = jest.fn();
    const p = P.create({ fn: spy });

    p.f1('f1_1', 'f1_2').f2('f2_1', 'f2_2');

    expect(spy.mock.calls).toEqual([
      [{ get: 'f1' }],
      [{ apply: ['f1_1', 'f1_2'] }],
      [{ get: 'f2' }],
      [{ apply: ['f2_1', 'f2_2'] }],
    ]);
  });

  it('correctly convert to primitives', () => {
    const p = P.create({ name: '@custom-name' });

    // expect(p.toString()).toBe('@custom-name');
    // expect(p.valueOf()).toBe('@custom-name');
    expect(p[Symbol.toPrimitive]()).toBe('@custom-name');
  });

  it('not blow up on nested proxy in arguments', () => {
    const spy = jest.fn();
    const p1 = P.create(spy);
    const p2 = P.create();

    p1.callSmth(p2);
    expect(spy.mock.calls).toEqual([[{ get: 'callSmth' }], [{ apply: [p2] }]]);
  });

  it('accept reserverFields map', () => {
    const p = P.create({
      reservedFields: {
        length: 10,
      },
    });

    expect(p.length).toBe(10);
  });

  it('be composable', () => {
    const spy = jest.fn();
    const p = P.create({
      fn: spy,
      reservedFields: {
        length: 1,
        call: Function.prototype.call,
        apply: Function.prototype.apply,
      },
    });
    const s = P.select(spy);

    const calls = compose(p.method2, p.method1);

    calls(24);

    expect(s.callIndex([24])).not.toEqual(-1);
    expect(s.callIndex([p])).not.toEqual(-1);
  });
});
