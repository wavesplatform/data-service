const Joi = require('./joi');

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
    const validateCursor = validate(Joi.string().cursor());
    assertPass(
      validateCursor(
        'MjAxOC0wOS0xOFQxMzo0NDozNC4wMDBaOjo2b3NpNGI2Q3FrS3oyMVVtWDlxeXdydDJ1aXQ4U1VCOE1udndONjJhNnFLbzo6ZGVzYw=='
      )
    );
    assertError(validateCursor('q')); // not base64
    assertError(validateCursor('MjAxOC0wOS')); // not decodable
    assertError(validateCursor(1));
    assertError(validateCursor(null));
  });

  it('should validate cursor correctly', () => {
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
});
