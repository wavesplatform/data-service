import { createSql } from '../../../_common/sql';
import { filters, filtersOrder } from './filters';

import { select } from './query';

export default createSql({
  query: select,
  filters,
  filtersOrder,
});
