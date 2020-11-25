import { Joi } from '../../../../utils/validation';

import commonFilters from '../../../_common/presets/pg/search/commonFilterSchemas';
import commonFields from '../../_common/commonFieldsSchemas';

export const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    assetId: Joi.string().assetId(),
  })
  .nand('sender', 'senders');

export const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string().assetId().required(),
  asset_name: Joi.string().required(),
  description: Joi.string().required().allow(''),
});
