const { parseArrayQuery } = require('./parseArrayQuery');

describe('parseArrayQuery should correctly parse', () => {
  it('strings with multiple values', () => {
    expect(parseArrayQuery('id1,id2')).toEqual(['id1', 'id2']);
  });

  it('strings with one value', () => {
    expect(parseArrayQuery('id1')).toEqual(['id1']);
  });

  it('empty string to empty array', () => {
    expect(parseArrayQuery('')).toEqual([]);
  });

  it('arrays', () => {
    expect(parseArrayQuery([])).toEqual([]);
    expect(parseArrayQuery(['q', 'w'])).toEqual(['q', 'w']);
  });

  it('undefined to undefined', () => {
    expect(parseArrayQuery()).toBe(undefined);
  });
});
