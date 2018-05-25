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

  it('`has` any field returns true for anything if no keys provided', () => {
    const p = P.create();
    expect('anykey' in p).toBe(true);
    expect('anykey2' in p).toBe(true);
  });

  it('`has` any field returns true for provided keys only', () => {
    const p = P.create({ keys: ['key1', 'key2'] });
    expect('key1' in p).toBe(true);
    expect('key2' in p).toBe(true);
    expect('wrong_key' in p).toBe(false);
  });

  it('`ownKeys` returns provided keys or empty array', () => {
    const p1 = P.create();
    const p2 = P.create({ keys: ['key1', 'key2'] });

    expect(Reflect.ownKeys(p1)).toEqual([]);
    expect(Reflect.ownKeys(p2)).toEqual(['key1', 'key2']);
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

  it('should correctly convert to primitives', () => {
    const p = P.create({ name: '@custom-name' });

    expect(p.toString()).toBe('@custom-name');
    expect(p.valueOf()).toBe('@custom-name');
    expect(p[Symbol.toPrimitive]()).toBe('@custom-name');
  });

  it('should not blow up on nested proxy in arguments', () => {
    const spy = jest.fn();
    const p1 = P.create(spy);
    const p2 = P.create();

    p1.callSmth(p2);
    expect(spy.mock.calls).toEqual([[{ get: 'callSmth' }], [{ apply: [p2] }]]);
  });
});
