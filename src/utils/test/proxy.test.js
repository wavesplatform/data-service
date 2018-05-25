const createProxy = require('./proxy');

describe('Test proxy should', () => {
  it('object type is `function`', () => {
    const p = createProxy();
    expect(typeof p).toBe('function');
  });

  it('call provided function for fields', () => {
    const spy = jest.fn();
    const p = createProxy(spy);

    p.f1.f2.f3;

    expect(spy.mock.calls).toEqual([
      [{ get: 'f1' }],
      [{ get: 'f2' }],
      [{ get: 'f3' }],
    ]);
  });

  it('any field value type is `function`', () => {
    const p = createProxy();
    expect(typeof p.qwe.rty).toBe('function');
  });

  it('call provided function for methods', () => {
    const spy = jest.fn();
    const p = createProxy(spy);

    p.f1('f1_1', 'f1_2').f2('f2_1', 'f2_2');

    expect(spy.mock.calls).toEqual([
      [{ get: 'f1' }],
      [{ apply: ['f1_1', 'f1_2'] }],
      [{ get: 'f2' }],
      [{ apply: ['f2_1', 'f2_2'] }],
    ]);
  });

  it('any method call return type is `function`', () => {
    const p = createProxy();
    expect(typeof p.qwe().rty()).toBe('function');
  });

  it('`has` any field returns true for anything if no keys provided', () => {
    const p = createProxy();
    expect('anykey' in p).toBe(true);
    expect('anykey2' in p).toBe(true);
  });

  it('`has` any field returns true for provided keys only', () => {
    const p = createProxy(() => {}, ['key1', 'key2']);
    expect('key1' in p).toBe(true);
    expect('key2' in p).toBe(true);
    expect('wrong_key' in p).toBe(false);
  });

  it('`ownKeys` returns provided keys or empty array', () => {
    const p1 = createProxy();
    const p2 = createProxy(() => {}, ['key1', 'key2']);

    expect(Reflect.ownKeys(p1)).toEqual([]);
    expect(Reflect.ownKeys(p2)).toEqual(['key1', 'key2']);
  });
});

module.exports = createProxy;
