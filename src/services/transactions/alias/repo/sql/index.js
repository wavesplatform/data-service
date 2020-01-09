import { compose } from 'ramda';

import * as createSql from '../../../_common/sql';
import { sort } from '../../../_common/sql/filters';
import { select, withFirstOnly } from './query';

const queryAfterFilters = {
  get: withFirstOnly,
  mget: withFirstOnly,
  search: (q, fValues) => compose(sort(fValues.sort), withFirstOnly)(q),
};

export default createSql({
  query: select,
  queryAfterFilters,
});
