const { Ok: ok } = require('folktale/result');
const { parseArrayQuery } = require('../parseArrayQuery');

describe('parseArrayQuery should correctly parse', () => {
  it('strings with multiple values', () => {
    expect(parseArrayQuery('id1,id2')).toEqual(ok(['id1', 'id2']));
  });

  it('strings with one value', () => {
    expect(parseArrayQuery('id1')).toEqual(ok(['id1']));
  });

  it('empty string to empty array', () => {
    expect(parseArrayQuery('')).toEqual(ok([]));
  });

  it('arrays', () => {
    expect(parseArrayQuery([])).toEqual(ok([]));
    expect(parseArrayQuery(['q', 'w'])).toEqual(ok(['q', 'w']));
  });

  it('undefined to undefined', () => {
    expect(parseArrayQuery()).toEqual(ok(undefined));
  });
});
