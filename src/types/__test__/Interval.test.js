const Interval = require('../Interval');

describe('Interval', () => {
  const i = Interval('180s');

  it('should throw if wrong arguments provided', () => {
    expect(() => Interval(10)).toThrow('String argument expected');
    expect(() => Interval('1.5s')).toThrow(
      'String argument does not match interval pattern'
    );
  });

  describe('from method', () => {
    it('should return Result.Ok if correct args are given', () => {
      const i = Interval.from('10s').getOrElse(null);
      expect(i.length).toBe(10000);
    });

    it('should return Result.Error if wrong args are given', () => {
      const i = Interval.from('1.5s').getOrElse(null);
      expect(i).toBe(null);
    });
  });

  it('should keep its length in milliseconds', () => {
    expect(i.length).toBe(180000);
    expect(Interval('1h').length).toBe(3600000);
  });

  it('should be divisible by another Interval', () => {
    const i2 = Interval('1m');
    expect(i.div(i2)).toBe(3);
  });

  it('should serialize into string and JSON representation correctly', () => {
    expect(JSON.stringify(i)).toBe(JSON.stringify('180s'));
    expect(i.toString()).toBe('180s');
  });
});
