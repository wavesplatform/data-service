import { xor } from '../xor';

describe('xor', () => {
  it('should work correctly on booleans', () => {
    expect(xor(true, true)).toBe(false);
    expect(xor(true, false)).toBe(true);
    expect(xor(false, true)).toBe(true);
    expect(xor(false, false)).toBe(false);
  });

  it('should work correctly on strings', () => {
    expect(xor('a', 'a')).toBe(false);
    expect(xor('a', 'b')).toBe(true);
  });

  it('should work correctly on numbers', () => {
    expect(xor(1, 1)).toBe(false);
    expect(xor(1, 2)).toBe(true);
  });
});
