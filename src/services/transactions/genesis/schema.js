const { omit } = require('ramda');

const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
import commonFilters from '../../presets/pg/searchWithPagination/commonFilterSchemas';

const result = Joi.object().keys({
  // genesis txs do not have a sender
  ...omit(['sender', 'sender_public_key'], commonFields),

  amount: Joi.object()
    .bignumber()
    .required(),
  recipient: Joi.string().required(),
});

const inputSearch = Joi.object().keys(omit(['sender'], commonFilters));

module.exports = { result, inputSearch };
