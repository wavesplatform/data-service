import * as Joi from '../../utils/validation/joi';
import { output as balanceSchema } from '../balances/schema';
import { output as dataEntriesSchema } from '../data-entries/schema';

export const inputGet = Joi.string().base58();
export const inputMget = Joi.array().items(inputGet);

export const output = Joi.object().keys({
  balances: Joi.array().items(balanceSchema),
  dataEntries: Joi.array().items(dataEntriesSchema),
});
