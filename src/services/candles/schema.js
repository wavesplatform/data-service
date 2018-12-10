const Joi = require('../../utils/validation/joi');
const Interval = require('../../types/Interval');

const customJoi = Joi.extend(joi => ({
  base: joi.object(),
  name: 'object',
  language: {
    period: {
      timeStart: 'must be a valid time value',
      timeEnd: 'must be a valid time value',
      timeEndGt: 'time end must be greater then time start',
      interval: {
        valid: 'must be a valid interval value',
      },
      divisibleByLeftBound: 'must be divisible by left bound in {{bounds}}',
      limit: '{{candlesCount}} of candles is more then allowed of {{limit}}',
    },
  },
  rules: [
    {
      name: 'period',
      params: {
        options: joi.object().keys({
          divisibleByLeftBound: joi.array().items(joi.string()),
          limit: joi.number().integer(),
        }),
      },
      validate(params, value, state, options) {
        if (
          joi
            .date()
            .required()
            .validate(value.timeStart).error
        ) {
          return this.createError(
            'object.period.timeStart',
            { value },
            state,
            options
          );
        }

        if (
          joi
            .date()
            .required()
            .validate(value.timeEnd).error
        ) {
          return this.createError(
            'object.period.timeEnd',
            { value },
            state,
            options
          );
        }

        if (value.timeEnd < value.timeStart) {
          return this.createError(
            'object.period.timeEndGt',
            { value },
            state,
            options
          );
        }

        if (
          joi
            .string()
            .period()
            .accept(['m', 'h', 'd', 'M', 'Y'])
            .divisibleBy('1m')
            .min('1m')
            .max('1M')
            .required()
            .validate(value.interval).error
        ) {
          return this.createError(
            'object.period.interval.valid',
            { value },
            state,
            options
          );
        }

        const valueInterval = Interval(value.interval);

        if (params.options.divisibleByLeftBound) {
          for (let bound of params.options.divisibleByLeftBound) {
            const boundInterval = Interval(bound);
            if (
              valueInterval.length > boundInterval.length &&
              valueInterval.div(boundInterval) % 1 !== 0
            ) {
              return this.createError(
                'object.period.divisibleByLeftBound',
                { value, bounds: params.options.divisibleByLeftBound },
                state,
                options
              );
            }
          }
        }

        if (params.options.limit) {
          const periodLength = value.timeEnd - value.timeStart;
          const expectedCandlesCount = Math.ceil(
            periodLength / valueInterval.length
          );
          if (expectedCandlesCount > params.options.limit) {
            return this.createError(
              'object.period.limit',
              {
                value,
                candlesCount: expectedCandlesCount,
                limit: params.options.limit,
              },
              state,
              options
            );
          }
        }

        return value;
      },
    },
  ],
}));

const inputSearch = Joi.object()
  .keys({
    amountAsset: Joi.string()
      .base58()
      .required(),
    priceAsset: Joi.string()
      .base58()
      .required(),
    params: customJoi
      .object()
      .period({
        divisibleByLeftBound: ['1d', '1h', '1m'],
        limit: 1440,
      })
      .required(),
  })
  .required();

const output = Joi.object().keys({
  time_start: Joi.date().required(),
  amount_asset_id: Joi.string()
    .base58()
    .required(),
  price_asset_id: Joi.string()
    .base58()
    .required(),
  max_height: Joi.number()
    .integer()
    .required(),
  open: Joi.object()
    .bignumber()
    .required(),
  high: Joi.object()
    .bignumber()
    .required(),
  low: Joi.object()
    .bignumber()
    .required(),
  close: Joi.object()
    .bignumber()
    .required(),
  volume: Joi.object()
    .bignumber()
    .required(),
  quote_volume: Joi.object()
    .bignumber()
    .required(),
  weighted_average_price: Joi.object()
    .bignumber()
    .required(),
  txs_count: Joi.number().required(),
  interval_in_secs: Joi.number()
    .integer()
    .valid([60, 300, 900, 1800, 3600, 86400]) // 1min, 5min, 15min, 30min, 1hour, 1day
    .required(),
  a_dec: Joi.number().required(),
  p_dec: Joi.number().required(),
});

module.exports = { inputSearch, output };
