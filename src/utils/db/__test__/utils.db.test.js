const Maybe = require('folktale/maybe');
const {
  matchRequestsResults,
  escapeForTsQuery,
  escapeForLike,
  prepareForLike,
} = require('../');

const matchFn = (req, res) => res === req * 10;

describe('Batch query results should', () => {
  it('match ordering of requests', () => {
    expect(
      matchRequestsResults(matchFn, [10, 20, 30], [300, 200, 100])
    ).toEqual([100, 200, 300].map(Maybe.fromNullable));
  });

  it('insert nulls if no matching response found', () => {
    expect(matchRequestsResults(matchFn, [10, 20, 30], [300, 100])).toEqual(
      [100, null, 300].map(Maybe.fromNullable)
    );
    expect(matchRequestsResults(matchFn, [10, 20, 30], [])).toEqual(
      [null, null, null].map(Maybe.fromNullable)
    );
  });

  it('ignore results not matching any request', () => {
    expect(matchRequestsResults(matchFn, [10, 20, 30], [300, 900])).toEqual(
      [null, null, 300].map(Maybe.fromNullable)
    );
  });
});

describe('Escaping for tsquery', () => {
  it('should correctly escape simple string', () => {
    expect(escapeForTsQuery('some')).toBe('some');
  });
  it('should correctly escape simple string with comma', () => {
    expect(escapeForTsQuery('some,')).toBe('some');
  });
  it('should correctly escape two words', () => {
    expect(escapeForTsQuery('some string')).toBe('some & string');
  });
  it('should correctly escape two words with "!" symbol', () => {
    expect(escapeForTsQuery('some string!')).toBe('some & string');
  });
  it('should correctly escape three words with "!" and "%" symbols', () => {
    expect(escapeForTsQuery('some string! %another')).toBe(
      'some & string & another'
    );
  });
});

describe('Escaping for like', () => {
  it('should correctly escape simple word', () => {
    expect(escapeForLike('some')).toBe('some');
  });
  it('should correctly escape "%" symbol', () => {
    expect(escapeForLike('%')).toBe('\\%');
  });
  it('should correctly escape two words', () => {
    expect(escapeForLike('some string')).toBe('some string');
  });
  it('should correctly escape two words started and ended with "%" symbol', () => {
    expect(escapeForLike('%some string%')).toBe('\\%some string\\%');
  });
  it('should correctly escape two words with 3 "%" symbols (at start start, at the middle and in the end', () => {
    expect(escapeForLike('%some string%')).toBe('\\%some string\\%');
  });
});

describe('Preparing for like', () => {
  it('should correctly prepare simple word', () => {
    expect(prepareForLike('some')).toBe('some%');
  });
  it('should correctly prepare simple word without params', () => {
    expect(prepareForLike('some', {})).toBe('some%');
  });
  it('should correctly prepare simple word with matchExactly=true', () => {
    expect(prepareForLike('some', { matchExactly: true })).toBe('some');
  });
  it('should correctly prepare "%" symbol', () => {
    expect(prepareForLike('%')).toBe('\\%%');
  });
  it('should correctly prepare "%" symbol with matchExactly=true', () => {
    expect(prepareForLike('%', { matchExactly: true })).toBe('\\%');
  });
  it('should correctly prepare two words started and ended with "%"', () => {
    expect(prepareForLike('%some string%')).toBe('\\%some string\\%%');
  });
  it('should correctly prepare two words started and ended with "%" with matchExactly=true', () => {
    expect(prepareForLike('%some string%', { matchExactly: true })).toBe(
      '\\%some string\\%'
    );
  });
});
