const pg = require('knex')({ client: 'pg' });
const { where, orWhere, hasMethod } = require('../lib');

const { curryN, compose } = require('ramda');

test('`hasMethod` works with real knex obj', () => {
  const q = pg.table('t').select('x');
  expect(hasMethod('where', q)).toBe(true);
  expect(hasMethod('orWhere', q)).toBe(true);
});

describe('Pointfree methods should work with real knex object', () => {
  const qIncludes = curryN(2, (pOrPs, str) => {
    const ps = Array.isArray(pOrPs) ? pOrPs : [pOrPs];
    return ps.every(p => str.toString().indexOf(p) !== -1);
  });
  const q = pg.table('t').select('x');

  it('pointfree fns should not mutate original query', () => {
    expect(qIncludes(['select', 't', 'x'], q)).toBe(true);

    // before applying `where`
    expect(qIncludes(['where', 'id', '2'], q)).toBe(false);

    const qWhereId2 = where('id', 2, q);
    expect(qIncludes(['where', 'id', '2'], qWhereId2)).toBe(true);

    // after applying `where` — same
    expect(qIncludes(['where', 'id', '2'], q)).toBe(false);
  });

  it('`where` pointfree', () => {
    expect(qIncludes(['select', 't', 'x'], q)).toBe(true);

    const qWhereId2 = where('id', 2, q);
    expect(qIncludes(['where', 'id', '2'], qWhereId2)).toBe(true);

    const qWhereIdGte2 = where('id', '>=', 2, q);
    expect(qIncludes(['where', 'id', '>=', '2'], qWhereIdGte2)).toBe(true);
  });

  it('`orWhere` pointfree', () => {
    expect(qIncludes(['select', 't', 'x'], q)).toBe(true);

    const qWhereId2OrSenderGte3 = compose(
      orWhere('sender', '>=', 3),
      where('id', 2)
    )(q);

    expect(
      qIncludes(
        ['where', 'id', '2', 'or', 'sender', '>=', '3'],
        qWhereId2OrSenderGte3
      )
    ).toBe(true);
  });
});
