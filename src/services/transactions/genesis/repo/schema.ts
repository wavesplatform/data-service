import { omit } from 'ramda';

import { Joi } from '../../../../utils/validation';

import commonFields from '../../_common/commonFieldsSchemas';

export const result = Joi.object().keys({
  // genesis txs do not have a sender
  ...omit(['sender', 'sender_public_key'], commonFields),

  amount: Joi.object()
    .bignumber()
    .required(),
  recipient: Joi.string().required(),
});
