const Joi = require('../../utils/validation/joi');
const { interval, CandleIntervals } = require('../../types');

const candleIntervals = [
  CandleIntervals.Month1,
  CandleIntervals.Week1,
  CandleIntervals.Day1,
  CandleIntervals.Hour12,
  CandleIntervals.Hour6,
  CandleIntervals.Hour4,
  CandleIntervals.Hour3,
  CandleIntervals.Hour2,
  CandleIntervals.Hour1,
  CandleIntervals.Minute30,
  CandleIntervals.Minute15,
  CandleIntervals.Minute5,
  CandleIntervals.Minute1,
];

const customJoi = Joi.extend(joi => ({
  base: joi.object(),
  name: 'object',
  language: {
    period: {
      timeStart: 'must be a valid time value',
      timeEnd: 'must be a valid time value',
      timeEndGt: 'time end must be greater then time start',
      interval: {
        valid: 'interval must be a valid interval value',
      },
      divisibleByLeftBound: 'must be divisible by left bound in {{bounds}}',
      limit: '{{candlesCount}} of candles is more then allowed of {{limit}}',
      allow: 'must be one of {{allowed}} interval',
    },
  },
  rules: [
    {
      name: 'period',
      params: {
        options: joi.object().keys({
          divisibleByLeftBound: joi.array().items(joi.string().noNullChars()),
          limit: joi.number().integer(),
          allow: joi.array().items(joi.string().noNullChars()),
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
            .accept(['s', 'm', 'h', 'd', 'w', 'M', 'Y'])
            .divisibleBy(CandleIntervals.Minute1)
            .min(CandleIntervals.Minute1)
            .max(CandleIntervals.Month1)
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

        const valueInterval = interval(value.interval).getOrElse(null);

        if (params.options.divisibleByLeftBound) {
          for (let bound of params.options.divisibleByLeftBound) {
            const boundInterval = interval(bound).getOrElse(null);
            if (
              valueInterval.length >= boundInterval.length &&
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

        if (params.options.allow) {
          if (params.options.allow.indexOf(value.interval) === -1) {
            return this.createError(
              'object.period.allow',
              {
                value,
                allowed: params.options.allow,
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

const inputSearch = customJoi
  .object()
  .keys({
    amountAsset: Joi.string()
      .assetId()
      .required(),
    priceAsset: Joi.string()
      .assetId()
      .required(),
    timeStart: Joi.date().required(),
    timeEnd: Joi.date().required(),
    interval: Joi.string()
      .noNullChars()
      .required(),
    matcher: Joi.string().base58(),
  })
  .period({
    limit: 1440,
    allow: candleIntervals,
  })
  .required();

const output = Joi.object().keys({
  time_start: Joi.date().required(),
  amount_asset_id: Joi.string()
    .assetId()
    .required(),
  price_asset_id: Joi.string()
    .assetId()
    .required(),
  matcher: Joi.string().base58(),
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
  interval: Joi.string()
    .valid(candleIntervals)
    .required(),
  a_dec: Joi.number().required(),
  p_dec: Joi.number().required(),
});

module.exports = { inputSearch, output };
