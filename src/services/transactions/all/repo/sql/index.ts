import { createSql } from '../../../_common/sql';

import { select } from './query';
import { filters } from './filters';

export default createSql({
  query: select,
  filters,
});
