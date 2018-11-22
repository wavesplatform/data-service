const rawJoi = require('joi');

const { BigNumber } = require('@waves/data-entities');
const Cursor = require('../../services/_common/pagination/cursor');
const { base58: base58Regex, interval: intervalRegex } = require('../regex');
const { parseInterval, intervalValue } = require('../interval');

module.exports = rawJoi
  .extend(joi => ({
    base: joi.string(),
    name: 'string',
    language: {
      base58: 'must be a valid base58 string',
      period: 'must be a valid period of time',
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

          const [ts, id, sort] = Cursor.decode(value);
          if (!ts || !id || !sort) {
            // Generate an error, state and options need to be passed
            return this.createError('string.cursor', { value }, state, options);
          }
          return value; // Everything is OK
        },
      },
      {
        name: 'period',
        validate(_, value, state, options) {
          if (
            joi
              .string()
              .regex(intervalRegex)
              .validate().error
          ) {
            return this.createError('string.period', { value }, state, options);
          }

          return value;
        },
      },
      {
        name: 'accepted',
        params: {
          accepted: joi.array(),
        },
        validate(params, value, state, options) {
          const parsedValue = parseInterval(value);

          if (params.accepted.indexOf(parsedValue[1]) === -1) {
            return this.createError(
              'string.period.accepted',
              { value },
              state,
              options
            );
          }

          return value;
        },
      },
      {
        name: 'min',
        params: {
          min: joi.string().regex(/^\d+\w{1}/),
        },
        validate(params, value, state, options) {
          const parsedValue = parseInterval(value);

          const min = parseInterval(params.min);
          const minValue = intervalValue(min);

          if (minValue > intervalValue(parsedValue)) {
            return this.createError(
              'string.period.min',
              { value },
              state,
              options
            );
          }

          return value;
        },
      },
      {
        name: 'max',
        params: {
          max: joi.string().regex(/^\d+\w{1}/),
        },
        validate(params, value, state, options) {
          const parsedValue = parseInterval(value);

          const max = parseInterval(params.max);
          const maxValue = intervalValue(max);

          if (maxValue < intervalValue(parsedValue)) {
            return this.createError(
              'string.period.max',
              { value },
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
