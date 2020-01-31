const Joi = require('./joi');
const { deserialize } = require('../../services/transactions/_common/cursor');

const { BigNumber } = require('@waves/data-entities');

const validate = s => v => Joi.validate(v, s, { convert: false });
const assertPass = x => expect(x.error).toBe(null);
const assertError = x => expect(x.error).not.toBe(null);

describe('Joi extended with custom types', () => {
  it('should validate simple strings correctly (despite override)', () => {
    const validateString = validate(Joi.string());
    assertPass(validateString('q'));
    assertError(validateString(1));
    assertError(validateString(null));
  });

  it('should validate cursor correctly', () => {
    const validateCursor = validate(Joi.cursor().valid(deserialize));
    assertPass(validateCursor('MjUwMDAwMDA6OmRlc2M='));
    assertError(validateCursor('q')); // not base64
    assertError(validateCursor('MjAxOC0wOS')); // not decodable
    assertError(validateCursor(1));
    assertError(validateCursor(null));
  });

  it('should validate base58 correctly', () => {
    const validateBase58 = validate(Joi.string().base58());

    assertPass(validateBase58('qwe'));
    // not base58 symbols
    assertError(validateBase58('+'));
    assertError(validateBase58('/'));
    assertError(validateBase58('0'));
    assertError(validateBase58('O'));
    assertError(validateBase58('l'));
    assertError(validateBase58('I'));
  });

  it('should validate bignumbers correctly', () => {
    const validateInt64 = validate(
      Joi.object()
        .bignumber()
        .int64()
    );

    // a good int 64
    assertPass(validateInt64(new BigNumber(100)));

    // not a BigNumber
    assertError(validateInt64(1));

    // out of range
    const error = validateInt64(new BigNumber('9223372036854775808'));
    assertError(error); // not base64
    expect(error.error.toString()).toContain(
      'The number 9223372036854775808 is outside int64 range'
    );
  });

  describe('period', () => {
    it('should validates interval correctly', () => {
      const validatePeriod = validate(Joi.string().period());

      assertPass(validatePeriod('1d'));
      assertPass(validatePeriod('30m'));

      assertError(validatePeriod('11'));
      assertError(validatePeriod('hh'));
    });

    it('should validates accepted intervals correclty', () => {
      const validatePeriod = validate(
        Joi.string()
          .period()
          .accept(['m', 'h', 'd'])
      );

      assertPass(validatePeriod('1m'));
      assertPass(validatePeriod('1d'));

      assertError(validatePeriod('1s'));
      assertError(validatePeriod('1Y'));
    });

    it('should validates min intervals correclty', () => {
      const validatePeriod = validate(
        Joi.string()
          .period()
          .min('1m')
      );

      assertPass(validatePeriod('1m'));
      assertPass(validatePeriod('60s'));

      assertError(validatePeriod('0m'));
      assertError(validatePeriod('0s'));
    });

    it('should validates max intervals correclty', () => {
      const validatePeriod = validate(
        Joi.string()
          .period()
          .max('1d')
      );

      assertPass(validatePeriod('1d'));
      assertPass(validatePeriod('24h'));

      assertError(validatePeriod('2d'));
      assertError(validatePeriod('25h'));
    });

    it('should validates divisible by intervals correclty', () => {
      const validatePeriod = validate(
        Joi.string()
          .period()
          .divisibleBy('2m')
      );

      assertPass(validatePeriod('2m'));
      assertPass(validatePeriod('10m'));
      assertPass(validatePeriod('120s'));
      assertPass(validatePeriod('1h'));

      assertError(validatePeriod('1m'));
      assertError(validatePeriod('3m'));
      assertError(validatePeriod('180s'));
    });
  });
});
