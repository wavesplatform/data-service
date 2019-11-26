const rawJoi = require('joi');

const { BigNumber } = require('@waves/data-entities');
const {
  base58: base58Regex,
  interval: intervalRegex,
  assetId: assetIdRegex,
  noNullChars: noNullCharsRegex,
  saneForDbLike: saneForDbLikeRegex,
} = require('../regex');
const { interval } = require('../../types');
const { div } = require('../interval');
const Maybe = require('folktale/maybe');

const regexRule = (joi, name, regexes) => ({
  name,
  validate(_, value, state, options) {
    for (const { regex, errorCode } of regexes) {
      if (
        joi
          .string()
          .regex(regex)
          .validate(value).error
      ) {
        return this.createError(errorCode, { value }, state, options);
      }
    }
    return value;
  },
});

module.exports = rawJoi
  .extend(joi => ({
    base: joi.string(),
    name: 'string',
    language: {
      base58: 'must be a valid base58 string',
      assetId: 'must be a valid base58 string or "WAVES"',
      base64Prefixed: 'must be a string of "base64:${base64EncodedString}"',
      noNullChars: 'must not contain unicode null characters',
      saneForDbLike: 'must not end with unescaped slash symbol',
      pair: 'must be a valid pair string',
      period: {
        value: 'must be a valid interval value',
        accept: 'must be in accepted',
        divisibleBy: 'must be divisible by divider',
        min: 'must be more then min',
        max: 'must be less then max',
      },
    },
    rules: [
      regexRule(joi, 'base58', [
        { regex: base58Regex, errorCode: 'string.base58' },
      ]),
      regexRule(joi, 'assetId', [
        { regex: assetIdRegex, errorCode: 'string.assetId' },
      ]),
      regexRule(joi, 'noNullChars', [
        { regex: noNullCharsRegex, errorCode: 'string.noNullChars' },
      ]),
      regexRule(joi, 'period', [
        { regex: intervalRegex, errorCode: 'string.period.value' },
      ]),
      regexRule(joi, 'saneForDbLike', [
        { regex: saneForDbLikeRegex, errorCode: 'string.saneForDbLike' },
        { regex: noNullCharsRegex, errorCode: 'string.noNullChars' },
      ]),
      {
        name: 'base64Prefixed',
        validate(_, value, state, options) {
          // the value should be "base64:${base4dEncodedString}"
          return Maybe.of(value)
            .filter(it => typeof it === 'string')
            .map(it => it.split(':'))
            .filter(it => it.length === 2)
            .filter(
              ([prefix, val]) =>
                prefix === 'base64' &&
                !joi
                  .string()
                  .base64({ paddingRequired: false })
                  .validate(val).error
            )
            .matchWith({
              Just: () => value,
              Nothing: () =>
                this.createError(
                  'string.base64Prefixed',
                  { value },
                  state,
                  options
                ),
            });
        },
      },
      {
        name: 'accept',
        params: {
          accept: joi.array(),
        },
        validate(params, value, state, options) {
          const i = interval(value);

          return i.matchWith({
            Ok: ({ value: i }) => {
              if (params.accept.indexOf(i.unit) === -1) {
                return this.createError(
                  'string.period.accept',
                  { value },
                  state,
                  options
                );
              }

              return value;
            },
            Error: ({ value: e }) =>
              this.createError(
                'string.period.accept',
                { value, e },
                state,
                options
              ),
          });
        },
      },
      {
        name: 'divisibleBy',
        params: {
          divisibleBy: joi.string().regex(intervalRegex),
        },
        validate(params, value, state, options) {
          const i = interval(value);
          const divisibleByInterval = interval(params.divisibleBy);

          return i.matchWith({
            Ok: ({ value: i }) =>
              divisibleByInterval.matchWith({
                Ok: ({ value: d }) => {
                  if (div(i, d) % 1 !== 0) {
                    return this.createError(
                      'string.period.divisibleBy',
                      { value },
                      state,
                      options
                    );
                  }

                  return value;
                },
                Error: ({ value: e }) =>
                  this.createError(
                    'string.period.divisibleBy',
                    { value, e },
                    state,
                    options
                  ),
              }),
            Error: ({ value: e }) =>
              this.createError(
                'string.period.interval',
                { value, e },
                state,
                options
              ),
          });
        },
      },
      {
        name: 'min',
        params: {
          min: joi.string().regex(intervalRegex),
        },
        validate(params, value, state, options) {
          const i = interval(value);
          const minInterval = interval(params.min);

          return i.matchWith({
            Ok: ({ value: i }) =>
              minInterval.matchWith({
                Ok: ({ value: d }) => {
                  if (d.length > i.length) {
                    return this.createError(
                      'string.period.minInterval',
                      { value },
                      state,
                      options
                    );
                  }
                  return value;
                },
                Error: ({ value: e }) =>
                  this.createError(
                    'string.period.minInterval',
                    { value, e },
                    state,
                    options
                  ),
              }),
            Error: ({ value: e }) =>
              this.createError(
                'string.period.interval',
                { value, e },
                state,
                options
              ),
          });
        },
      },
      {
        name: 'max',
        params: {
          max: joi.string().regex(intervalRegex),
        },
        validate(params, value, state, options) {
          const i = interval(value);
          const maxInterval = interval(params.max);

          return i.matchWith({
            Ok: ({ value: i }) =>
              maxInterval.matchWith({
                Ok: ({ value: d }) => {
                  if (d.length < i.length) {
                    return this.createError(
                      'string.period.maxInterval',
                      { value },
                      state,
                      options
                    );
                  }
                  return value;
                },
                Error: ({ value: e }) =>
                  this.createError(
                    'string.period.maxInterval',
                    { value, e },
                    state,
                    options
                  ),
              }),
            Error: ({ value: e }) =>
              this.createError(
                'string.period.interval',
                { value, e },
                state,
                options
              ),
          });
        },
      },
    ],
  }))
  .extend(joi => ({
    base: joi.object(),
    name: 'object',
    language: {
      bignumber: {
        nan: 'is Not a Number',
        int64: 'The number {{value}} is outside int64 range',
      },
    },
    rules: [
      {
        name: 'bignumber',
        validate(_, value, state, options) {
          if (!(value instanceof BigNumber)) {
            return this.createError(
              'object.type',
              { type: BigNumber },
              state,
              options
            );
          }
          return value;
        },
      },
      {
        name: 'notNan',
        validate(_, value, state, options) {
          if (!(value instanceof BigNumber) || value.isNaN()) {
            return this.createError(
              'object.bignumber.nan',
              { value: NaN },
              state,
              options
            );
          }
          return value;
        },
      },
      {
        name: 'int64',
        validate(_, value, state, options) {
          const BOUNDS = {
            LOWER: new BigNumber('-9223372036854775808'),
            UPPER: new BigNumber('9223372036854775807'),
          };

          if (
            !(value instanceof BigNumber) ||
            value.isLessThan(BOUNDS.LOWER) ||
            value.isGreaterThan(BOUNDS.UPPER)
          ) {
            return this.createError(
              'object.bignumber.int64',
              { value: value.toString() },
              state,
              options
            );
          }
          return value;
        },
      },
    ],
  }))
  .extend(joi => ({
    base: joi.string().base64({ paddingRequired: false }),
    name: 'cursor',
    language: {
      wrong: 'must be a valid cursor string',
    },
    rules: [
      {
        name: 'valid',
        params: {
          deserialize: joi
            .func()
            .arity(1)
            .required(),
        },
        validate(params, value, state, options) {
          return params.deserialize(value).matchWith({
            Ok: () => value,
            Error: () =>
              this.createError('cursor.wrong', { v: value }, state, options),
          });
        },
      },
    ],
  }));
