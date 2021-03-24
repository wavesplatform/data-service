import { createSql } from '../../../_common/sql';

import { select, selectFromFiltered } from './query';
import { filters } from './filters';

const queryAfterFilters = {
  get: selectFromFiltered,
  mget: selectFromFiltered,
  search: selectFromFiltered,
};

export default createSql({
  query: select,
  queryAfterFilters,
  filters,
});
