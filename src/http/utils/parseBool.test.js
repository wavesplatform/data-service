const { parseBool } = require('./parseBool');

describe('parseBool should correctly parse', () => {
  it('boolean values', () => {
    expect(parseBool(false)).toEqual(false);
    expect(parseBool(true)).toEqual(true);
  });

  it('falsy string values', () => {
    expect(parseBool('')).toEqual(false);
    expect(parseBool('false')).toEqual(false);
    expect(parseBool('FALSE')).toEqual(false);
    expect(parseBool('False')).toEqual(false);
    expect(parseBool('0')).toEqual(false);

    expect(parseBool('null')).toEqual(false);
    expect(parseBool('NULL')).toEqual(false);
    expect(parseBool('Null')).toEqual(false);

    expect(parseBool('undefined')).toEqual(false);
    expect(parseBool('NaN')).toEqual(false);
  });

  it('any other string values', () => {
    expect(parseBool('true')).toEqual(true);
    expect(parseBool('1')).toEqual(true);
    expect(parseBool('some string')).toEqual(true);
  });

  it('non-string truthy values', () => {
    expect(parseBool(1)).toEqual(true);
    expect(parseBool([])).toEqual(true);
    expect(parseBool({})).toEqual(true);
  });

  it('non-string falsy values', () => {
    expect(parseBool(null)).toEqual(false);
    expect(parseBool()).toEqual(false);
    expect(parseBool(NaN)).toEqual(false);
  });
});
