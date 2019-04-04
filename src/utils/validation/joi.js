const rawJoi = require('joi');

const { BigNumber } = require('@waves/data-entities');
const { decode } = require('../../services/_common/pagination/cursor');
const { base58: base58Regex, interval: intervalRegex } = require('../regex');
const { interval } = require('../../types');
const { div } = require('../interval');

module.exports = rawJoi
  .extend(joi => ({
    base: joi.string(),
    name: 'string',
    language: {
      base58: 'must be a valid base58 string',
      cursor: 'must be a valid cursor string',
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
      {
        name: 'base58',
        validate(_, value, state, options) {
          // assert base64
          if (
            joi
              .string()
              .regex(base58Regex)
              .validate(value).error
          ) {
            return this.createError('string.base58', { value }, state, options);
          }
          return value;
        },
      },
      {
        name: 'cursor',
        validate(_, value, state, options) {
          // assert base64
          if (
            joi
              .string()
              .base64({ paddingRequired: false })
              .validate(value).error
          ) {
            return this.createError('string.base64', { value }, state, options);
          }

          return decode(value).matchWith({
            Ok: () => value,
            Error: () =>
              this.createError('string.cursor', { value }, state, options),
          });
        },
      },
      {
        name: 'period',
        validate(_, value, state, options) {
          if (
            joi
              .string()
              .regex(intervalRegex)
              .validate(value).error
          ) {
            return this.createError(
              'string.period.value',
              { value },
              state,
              options
            );
          }

          return value;
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
  }));
