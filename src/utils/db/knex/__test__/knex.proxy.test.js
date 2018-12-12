const { where, orWhere, hasMethod, limit } = require('../lib');

const { create: createProxy } = require('../../../__test__/proxy');

const knexMock = {
  clone() {
    return this;
  },
  where: (...args) => args.concat('where'), // adding method name to make sure correct method is called
  orWhere: (...args) => args.concat('orWhere'),
};

test('hasMethod should work for different types', () => {
  const hasWhereMethod = hasMethod('where');

  expect(hasWhereMethod(undefined)).toBe(false);
  expect(hasWhereMethod(1)).toBe(false);
  expect(hasWhereMethod('qwe')).toBe(false);
  expect(hasWhereMethod({})).toBe(false);
  expect(hasWhereMethod(knexMock)).toBe(true);
});

test('hasMethod should accept test proxy as correct Knex mock', () => {
  const p = createProxy();
  expect(hasMethod('where', p)).toBe(true);
});

describe('Knex pointfree `where` should', () => {
  it('cover simple case without currying', () => {
    expect(where('id', 1, knexMock)).toEqual(['id', 1, 'where']);

    const wArgs = ['id', 1, 'some', null, undefined];
    expect(where(...wArgs.concat(knexMock))).toEqual(wArgs.concat('where'));
  });

  it('cover curried use', () => {
    expect(typeof where()).toBe('function');

    const where12 = where(1, 2);
    expect(typeof where12).toBe('function');

    const where1234 = where12(3, 4);
    expect(typeof where1234).toBe('function');

    expect(where1234(knexMock)).toEqual([1, 2, 3, 4, 'where']);
  });
});

describe('Knex pointfree `orWhere` should', () => {
  it('cover simple case without currying', () => {
    expect(orWhere('id', 1, knexMock)).toEqual(['id', 1, 'orWhere']);

    const wArgs = ['id', 1, 'some', null, undefined];
    expect(orWhere(...wArgs.concat(knexMock))).toEqual(wArgs.concat('orWhere'));
  });

  it('cover curried use', () => {
    expect(typeof orWhere()).toBe('function');

    const orWhere12 = orWhere(1, 2);
    expect(typeof orWhere12).toBe('function');

    const orWhere1234 = orWhere12(3, 4);
    expect(typeof orWhere1234).toBe('function');

    expect(orWhere1234(knexMock)).toEqual([1, 2, 3, 4, 'orWhere']);
  });
});

describe('Knex pointfree `limit` should', () => {
  it('cover simple case without currying', () => {
    const f = jest.fn();
    const p = createProxy(f);
    limit(100, p);

    expect(f.mock.calls.slice(-2)).toEqual([
      [{ get: 'limit' }],
      [{ apply: [100] }],
    ]);
  });

  it('cover curried use', () => {
    expect(typeof limit()).toBe('function');

    const limit100 = limit(100);
    expect(typeof limit100).toBe('function');

    const f = jest.fn();
    const p = createProxy(f);
    limit100(p);
    expect(f.mock.calls.slice(-2)).toEqual([
      [{ get: 'limit' }],
      [{ apply: [100] }],
    ]);
  });
});
