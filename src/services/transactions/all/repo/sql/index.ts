import { createSql } from '../../../_common/sql';
import * as filters from '../../../_common/sql/filters';

import { select } from './query';

export default createSql({
  query: select,
  filters,
});
